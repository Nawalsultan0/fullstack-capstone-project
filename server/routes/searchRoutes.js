// searchRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');

// GET /api/search?name=...&category=...&condition=...&age_years=...
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    const query = {};

    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    // Filter results based on category
    if (req.query.category && req.query.category.trim() !== '') {
      query.category = req.query.category;
    }

    if (req.query.condition && req.query.condition.trim() !== '') {
      query.condition = req.query.condition;
    }

    if (req.query.age_years) {
      query.age_years = { $lte: parseInt(req.query.age_years, 10) };
    }

    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
