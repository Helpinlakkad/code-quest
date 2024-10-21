// backend/routes/searchRoutes.js
const express = require('express');
const { searchQuery } = require('../controllers/searchController');
const router = express.Router();


router.get('/', (req, res) => {
    // Your search functionality here
    res.json({ message: 'Search API is working' });
  });


router.get('/search', searchQuery);

module.exports = router;
