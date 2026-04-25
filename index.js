const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (Required for cross-platform deployment)
app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
