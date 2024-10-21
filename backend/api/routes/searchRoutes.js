const express = require('express');
const { searchQuery } = require('../controllers/searchController');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Search API is working' });
});

router.get('/query', searchQuery);

module.exports = router;
