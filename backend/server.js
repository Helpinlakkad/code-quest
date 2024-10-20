// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const searchRoutes = require('./api/routes/searchRoutes');
const emailRoutes = require('./api/routes/emailRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Use body-parser to increase the limit
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit as needed

mongoose.connect(process.env.MONGO_URI);

app.use('/api/search', searchRoutes); // Search route
app.use('/api/send-email', emailRoutes); // Email route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
