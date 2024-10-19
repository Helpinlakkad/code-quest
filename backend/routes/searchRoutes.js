// backend/routes/searchRoutes.js
const express = require('express');
const { searchQuery } = require('../controllers/searchController');
const router = express.Router();

router.get('/', searchQuery);

module.exports = router;
