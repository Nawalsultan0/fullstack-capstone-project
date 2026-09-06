// giftRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');
const { ObjectId } = require('mongodb');

// GET /api/gifts - fetch all gift items
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();
    res.json(gifts);
  } catch (e) {
    next(e);
  }
});

// GET /api/gifts/:id - fetch a single gift item by id
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const id = req.params.id;

    const gift = await collection.findOne({ id: id });
    // Fallback: also try Mongo's own _id in case that's how you query
    if (!gift && ObjectId.isValid(id)) {
      const byObjectId = await collection.findOne({ _id: new ObjectId(id) });
      if (byObjectId) return res.json(byObjectId);
    }

    if (!gift) {
      return res.status(404).send('Gift not found');
    }
    res.json(gift);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
