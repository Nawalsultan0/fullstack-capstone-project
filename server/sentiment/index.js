// sentiment/index.js
const express = require('express');
const natural = require('natural');

const router = express.Router();
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'afinn');

// POST /api/sentiment - analyze the sentiment of a comment/review
router.post('/', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text field is required' });
  }

  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const score = analyzer.getSentiment(tokens);

  let sentiment = 'neutral';
  if (score > 0.1) sentiment = 'positive';
  else if (score < -0.1) sentiment = 'negative';

  res.json({ text, score, sentiment });
});

module.exports = router;
