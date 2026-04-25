const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
// When deployed on Railway with root as 'backend', frontend is at '../frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', apiRoutes);

// Route to serve the frontend index.html for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
