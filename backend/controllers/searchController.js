// backend/controllers/searchController.js
const axios = require('axios');
const Cache = require('../models/Cache'); // Cache model

exports.searchQuery = async (req, res) => {
  const query = req.query.q;

  const cachedResult = await Cache.findOne({ query });
  if (cachedResult) {
    return res.json(cachedResult.results);
  }

  try {
    const stackOverflow = await axios.get(`https://api.stackexchange.com/2.3/search/advanced`, {
      params: { order: 'desc', sort: 'relevance', q: query, site: 'stackoverflow' }
    });

    const reddit = await axios.get(`https://www.reddit.com/search.json`, { params: { q: query } });

    const results = {
      stackOverflow: stackOverflow.data.items,
      reddit: reddit.data.data.children
    };

    const newCache = new Cache({ query, results });
    await newCache.save();

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
};
