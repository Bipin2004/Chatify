// /backend/services/searchService.js
const axios = require('axios');

async function searchWeb(query) {
  const params = {
    api_key: process.env.SERPAPI_KEY,
    engine: 'google',     // you can choose "google", "bing", etc.
    q: query,
    num: 5
  };

  const { data } = await axios.get('https://serpapi.com/search', { params });

  // SerpAPI returns an array under `data.organic_results`
  // We’ll map that to our { name, snippet, url } shape:
  const results = (data.organic_results || []).slice(0,5).map(r => ({
    name:    r.title,
    snippet: r.snippet || r.description || '',
    url:     r.link
  }));

  return results;
}

module.exports = { searchWeb };
