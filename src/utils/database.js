// utils/database.js
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb+srv://kashem:dFP0NhtOblDuEGJt@cluster0.hmmua.mongodb.net/uprankly_dev'; // Replace with your MongoDB Atlas connection URI

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

export { connectToDatabase, client };
