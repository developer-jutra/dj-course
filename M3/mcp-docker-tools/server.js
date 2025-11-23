import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

import { fetchRepositoryTags, fetchRepositoryDetails } from './dockerhub-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const log = (...args) => {
  if (process.env.CONFIG_LOG_LEVEL?.toUpperCase() == "VERBOSE") {
    console.error(...args);
  }
};

const server = new McpServer({
  name: 'docker-tools',
  version: '1.0.0',
});

server.tool(
  'docker-image-tags',
  `
  Fetches an auto-paginated list of tags (versions) for a specified Docker repository.
  Subsequent requests automatically use "next", "prev" or "count" response properties, when available.
  `,
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    pages: z.number().default(1).describe('Number of pages to fetch'),
    pageSize: z.number().default(100).describe('Number of results per page'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-tags]', {options});
    let currentPage = 1;
    let response = await fetchRepositoryTags({ ...options, page: currentPage });
    let tags = response.results.map(tag => tag.name);
    while (response.next && currentPage < options.pages) {
      response = await fetchRepositoryTags({ ...options, page: currentPage });
      tags = tags.concat(response.results.map(tag => tag.name));
      currentPage++;
    }
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          tags,
          totalCount: response.count,
          fetchedCount: tags.length
        })
      }],
      isError: false,
    }
  }
);

server.tool(
  'docker-image-description',
  'Fetches detailed Docker repository description',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-description]', {options});
    const response = await fetchRepositoryDetails(options);
    return {
      content: [{ type: "text", text: response.full_description }],
      isError: false,
    }
  }
);

server.tool(
  'docker-image-details',
  'Fetches detailed metadata for a specified Docker repository',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
    version: z.string().default('v2').describe('Docker Hub API version to use')
  },
  async (options) => {
    log('[docker-image-details]', {options});
    const response = await fetchRepositoryDetails(options);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
      isError: false,
    }
  }
);

const ASPECT_NAMES = ['volumes', 'rootless'];

const DOCKER_DOCS_TEMPLATE = new ResourceTemplate('docs://docker/{aspect}', {
    list: async () => ({
        // Tworzymy listę metadanych dla każdego aspektu
        resources: ASPECT_NAMES.map(aspect => ({
            uri: `docs://docker/${aspect}`,
            name: `Docker Docs: ${aspect}`,
            mimeType: "text/markdown",
        })),
        nextCursor: undefined,
    }),
    // Opcjonalnie dodaj autouzupełnianie dla zmiennej {aspect}
    complete: {
        aspect: (value) => ASPECT_NAMES.filter(a => a.startsWith(value))
    }
});

server.resource(
    'docker-docs',
    DOCKER_DOCS_TEMPLATE,
    {
        title: 'Docker Documentation',
        description: 'Documentation for Docker',
        mimeType: "text/markdown", // Ustaw domyślny mimeType dla ułatwienia
    },
    // Callback do odczytu zawartości
    async (uri, variables, extra) => {
        const { aspect } = variables; // Wyciągnięcie zmiennej 'aspect' z obiektu variables

        try {
            const filePath = join(__dirname, 'docs', `${aspect}.md`);
            const content = readFileSync(filePath, 'utf-8'); // Synchroniczny odczyt dla prostoty
            
            // Zwracamy prawidłowy format ReadResourceResult
            return {
                contents: [{
                    // Należy zwrócić metadane zasobu wraz z jego treścią
                    uri: uri.href, // Pełne URI zasobu
                    name: `Docker Docs: ${aspect}`,
                    mimeType: "text/markdown",
                    text: content // Prawidłowo załadowana zawartość jako string
                }]
            };
        } catch (error) {
            // Jeśli plik nie istnieje lub jest błąd odczytu
            console.error(`Błąd odczytu dla ${uri.href}:`, error.message);
            throw new Error(`Resource content not available for ${aspect}.`); 
        }
    }
);

server.prompt(
  'docker-hints-with-parameter',
  'Wujku dobra rada, jak używać dockera...',
  {
    repository: z.string().describe('Namespace/name of the Docker repository'),
  },
  async (options) => ({
    messages: [
      {
        role: "system",
        content: {
          type: "text",
          text: `When querying tags for ${options.repository}:
          - Exclude 'latest' tag
          - Prioritize semantic versioning
          - Flag deprecated tags`
        }
      }
    ]
  })
);

server.prompt(
  'docker-hints-with-resource',
  'Wujku dobra rada, jak używać dockera...',
  {
    container: z.string().describe('Name of the Docker container'),
  },
  async (options) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Jesteś "Wujkiem Dobra Rada" i w oparciu o dostarczoną dokumentację na temat Dockera, odpowiedz na pytania użytkownika.
          Kiedy patrzysz na ustawienia kontenera ${options.container}, wówczas:
          - Używaj nazwanych wolumenów (named volumes) do trwałych danych, które mają przeżyć cykl życia kontenera, ponieważ są one zarządzane przez Docker i łatwiejsze do backupu i migracji.
          - W przypadku, gdy potrzebujesz dostępu do danych na hoście lub edycji kodu źródłowego, stosuj montowanie powiązań (bind mounts), ale bądź świadom, że ich dostępność zależy od struktury plików systemu hosta.
          - Zawsze używaj wolumenów do przechowywania danych, które mają być trwałe lub udostępniane między kontenerami, zamiast polegać na systemie plików kontenera, który jest ulotny.
          `
        }
      },
      {
        role: "user",
        content: {
          type: "resource",
          resource: { 
            uri: 'docs://docker/volumes',
            name: 'Docker Volumes Documentation',
          }
        }
      }
    ]
  })
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
