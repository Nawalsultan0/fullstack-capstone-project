// authRoutes.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existing = await collection.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser);

    const payload = { user: { id: result.insertedId } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ authtoken, email: newUser.email });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    // Locate the current user in the database via findOne
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      authtoken,
      userName: user.firstName,
      userEmail: user.email,
    });
  } catch (e) {
    next(e);
  }
});

// PUT /api/auth/update - update user profile info
router.put(
  '/update',
  [body('email').isEmail().withMessage('A valid email is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).json({ error: 'Authorization required' });
      }
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.user.id;

      const db = await connectToDatabase();
      const collection = db.collection('users');

      const existingUser = await collection.findOne({ email: req.body.email });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      existingUser.firstName = req.body.name || existingUser.firstName;
      existingUser.updatedAt = new Date();

      const { ObjectId } = require('mongodb');
      await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: existingUser },
        { returnDocument: 'after' }
      );

      const payload = { user: { id: userId } };
      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      res.json({ authtoken });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
