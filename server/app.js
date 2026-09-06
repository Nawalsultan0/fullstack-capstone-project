// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');

const giftRoutes = require('./api/giftRoutes');
const searchRoutes = require('./api/searchRoutes');
const authRoutes = require('./api/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure DB connects at startup
connectToDatabase()
  .then(() => console.log('Database connection established'))
  .catch((err) => console.error('Database connection failed', err));

app.use('/api/gifts', giftRoutes);

// Route that serves /api/search
app.use('/api/search', searchRoutes);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('GiftLink API is running');
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3060;
app.listen(PORT, () => {
  console.log(`GiftLink server listening on port ${PORT}`);
});

module.exports = app;
