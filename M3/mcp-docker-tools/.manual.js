const fetch = require('node-fetch');

async function fetchAllTags(image) {
  const tags = [];
  let url = `https://hub.docker.com/v2/repositories/library/${image}/tags?page_size=100`;
  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    tags.push(...data.results.map(tag => tag.name));
    url = data.next; // API provides next page URL if more tags exist
  }
  return tags;
}

fetchAllTags('postgres')
  .then(tags => {
    console.log('Available postgres tags:');
    console.log(tags);
  })
  .catch(err => {
    console.error('Error fetching tags:', err);
  });

