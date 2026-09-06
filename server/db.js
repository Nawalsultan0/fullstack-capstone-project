// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'giftdb';

const client = new MongoClient(url);

let dbInstance = null;

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  await client.connect();
  console.log('Connected to MongoDB successfully');

  dbInstance = client.db(dbName);
  return dbInstance;
}

module.exports = connectToDatabase;
