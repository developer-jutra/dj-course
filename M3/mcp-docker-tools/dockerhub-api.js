import fetch from 'node-fetch';

/**
 * Normalize a Docker repository string for API calls.
 * - Strips any tag suffix (after ':')
 * - Prepends 'library/' if no namespace is provided
 * @param {string} repositoryInput
 * @returns {string}
 */
function normalizeRepositoryName(repositoryInput) {
  // Strip tag suffix if present
  const repo = repositoryInput.split(':')[0];
  const parts = repo.split('/');
  // Reject invalid formats with more than one slash
  if (parts.length > 2) {
    throw new Error(`Invalid repository name: ${repositoryInput}`);
  }
  // If namespace/repo format, use as-is
  if (parts.length === 2) {
    return repo;
  }
  // Official images default to 'library/' namespace
  return `library/${repo}`;
}

// API endpoint helpers as a dictionary
const API_BASE_URL = 'https://hub.docker.com';
export const URLs = {
  getRepositoryTagsUrl: (repository, page, pageSize, version) => {
    const repoPath = normalizeRepositoryName(repository);
    return `${API_BASE_URL}/${version}/repositories/${repoPath}/tags?page=${page}&page_size=${pageSize}`;
  },
  getRepositoryDetailsUrl: (repository, version = 'v2') => {
    const repoPath = normalizeRepositoryName(repository);
    return `${API_BASE_URL}/${version}/repositories/${repoPath}`;
  }
};

/**
 * Fetch available tags for a given Docker repository from Docker Hub with pagination.
 *
 * @param {Object} options - The options for fetching tags.
 * @param {string} options.repository - The Docker repository name.
 * @param {number} [options.page=1] - The page number to fetch.
 * @param {number} [options.pageSize=100] - Number of tags to fetch per page.
 * @param {string} [options.version='v2'] - The Docker Hub API version to use.
 * @returns {Promise<string[]>} - A promise resolving to an array of tag names.
 */
export async function fetchRepositoryTags({ repository, page = 1, pageSize = 100, version = 'v2' }) {
  if (!repository) {
    return Promise.reject(new Error('Repository parameter is required'));
  }
  // Validate API version
  if (version === 'v1') {
    return Promise.reject(new Error("v1 is not supported anymore on Docker Hub"));
  }
  if (version !== 'v2') {
    return Promise.reject(new Error(`${version} is not supported`));
  }

  const url = URLs.getRepositoryTagsUrl(repository, page, pageSize, version);
  const response = await fetch(url);
  if (!response.ok) {
    return Promise.reject(new Error(`Failed to fetch: ${response.status} ${response.statusText}`));
  }
  return await response.json();
}

/**
 * Fetch metadata details for a given Docker repository from Docker Hub.
 *
 * @param {Object} options - Options for fetching repository details.
 * @param {string} options.repository - The Docker repository name.
 * @param {string} [options.version='v2'] - The Docker Hub API version to use.
 * @returns {Promise<Object>} - A promise resolving to the repository metadata.
 */
export async function fetchRepositoryDetails({ repository, version = 'v2' }) {
  if (!repository) {
    return Promise.reject(new Error('Repository parameter is required'));
  }
  // Validate API version
  if (version === 'v1') {
    return Promise.reject(new Error("v1 is not supported anymore on Docker Hub"));
  }
  if (version !== 'v2') {
    return Promise.reject(new Error(`${version} is not supported`));
  }
  const url = URLs.getRepositoryDetailsUrl(repository, version);
  const response = await fetch(url);
  if (!response.ok) {
    return Promise.reject(new Error(`Failed to fetch: ${response.status} ${response.statusText}`));
  }
  return await response.json();
}

