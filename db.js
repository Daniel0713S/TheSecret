const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const mongoUrl = process.env.MONGO_URL; // Add your MongoDB connection string to .env
let db;

const connectDB = async () => {
  if (db) return db; // Return existing connection if already established
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db(process.env.MONGO_DB_NAME || 'diaryApp'); // Use the database name from .env or default to "diaryApp"
  return db;
};

module.exports = connectDB;

