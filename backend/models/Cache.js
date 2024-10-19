// backend/models/Cache.js
const mongoose = require('mongoose');

const CacheSchema = new mongoose.Schema({
  query: String,
  results: Object,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cache', CacheSchema);
