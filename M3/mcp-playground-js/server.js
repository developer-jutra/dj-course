import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const log = (...args) => {
  if (process.env.CONFIG_LOG_LEVEL?.toUpperCase() == "VERBOSE") {
    console.error(...args);
  }
};

const server = new McpServer({
  name: 'DJServer',
  version: '1.0.0'
});

server.tool(
  'greet',
  'Greets a person by name',
  // MCP uses standard ts runtime type check libraries: zod, ajv, ...
  {
    name: z.string().describe('Recipient name'),
    //....
  },
  async ({ name }) => {
    log('[greet]', {name}); // ❗️ stderr
    // console.log('[greet]', {name}); // ❗️ stdout
    return {
      content: [{
        type: 'text',
        text: `Hello, ${name}! You are ${name.startsWith('A') ? 'awesome' : 'not awesome'}`
      }]
    }
  }
);

const RESOURCE_CONTENT = `
GEORGE WASHINGTON | 1789-1797
JOHN ADAMS | 1797-1801
THOMAS JEFFERSON | 1801-1809
JAMES MADISON | 1809-1817
JAMES MONROE | 1817-1825
JOHN QUINCY ADAMS | 1825-1829
ANDREW JACKSON | 1829-1837
MARTIN VAN BUREN | 1837-1841
WILLIAM HENRY HARRISON | 1841
JOHN TYLER | 1841-1845
JAMES K. POLK | 1845-1849
ZACHARY TAYLOR | 1849-1850
MILLARD FILLMORE | 1850-1853
FRANKLIN PIERCE | 1853-1857
JAMES BUCHANAN | 1857-1861
ABRAHAM LINCOLN | 1861-1865
ANDREW JOHNSON | 1865-1869
ULYSSES S. GRANT | 1869-1877
RUTHERFORD B. HAYES | 1877-1881
JAMES A. GARFIELD | 1881
CHESTER A. ARTHUR | 1881-1885
GROVER CLEVELAND | 1885-1889 / 1893-1897
BENJAMIN HARRISON | 1889-1893
WILLIAM MCKINLEY | 1897-1901
THEODORE ROOSEVELT | 1901-1909
WILLIAM HOWARD TAFT | 1909-1913
WOODROW WILSON | 1913-1921
WARREN G. HARDING | 1921-1923
CALVIN COOLIDGE | 1923-1929
HERBERT HOOVER | 1929-1933
FRANKLIN D. ROOSEVELT | 1933-1945
HARRY S. TRUMAN | 1945-1953
DWIGHT D. EISENHOWER | 1953-1961
JOHN F. KENNEDY | 1961-1963
LYNDON B. JOHNSON | 1963-1969
RICHARD M. NIXON | 1969-1974
GERALD R. FORD | 1974-1977
JIMMY CARTER | 1977-1981
RONALD REAGAN | 1981-1989
GEORGE BUSH | 1989-1993
WILLIAM J. CLINTON | 1993-2001
GEORGE W. BUSH | 2001-2009
BARACK OBAMA | 2009-2017
DONALD J. TRUMP | 2017-2021 / 2025-
JOSEPH R. BIDEN JR. | 2021-2025
`

server.resource(
    'american-presidents',
    'resources://american-presidents',
    {
        title: 'American Presidents',
        description: 'List of all presidents of the United States with their terms in office',
        mimeType: "text/markdown",
    },
    async (uri) => {
      return {
          contents: [{
              uri: uri.href,
              name: `American Presidents List`,
              mimeType: "text/markdown",
              text: RESOURCE_CONTENT
          }]
      };
    }
);

server.prompt(
  'ask-about',
  'Ask about a topic',
  {
    topic: z.string().describe('Topic to ask about'),
  },
  async (options) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `I need you to provide a detailed analysis about "${options.repository}" in the following format:
          - don't be sycophantic
          - provide bullet-point list-organized answer, each point has a short 1-sentence description
          - provide mermaid/markdown sequence diagrams where applicable 
          `
        }
      }
    ]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
