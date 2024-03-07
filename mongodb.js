 

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection URL
const mongoURI = process.env.mongoURI; // Replace with your MongoDB Atlas connection URI

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Database name you want to drop

async function dropDatabase(databaseName) {
 

  try {
    // Connect to the MongoDB server
    await client.connect();
 
    // Get a reference to the database you want to drop
    const database = client.db(databaseName);

    // Drop the database
    await database.dropDatabase();

    console.log(`Database "${databaseName}" dropped successfully.`);
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

async function deleteRecords(collectionName) {
 

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database and collection
    const database = client.db("uprankly_dev");
    const collection = database.collection(collectionName);

    // Delete all documents from the collection
    const deleteResult = await collection.deleteMany({});

    console.log(`${deleteResult.deletedCount} subscriptions deleted.`);
  } catch (error) {
    console.error("Error deleting subscriptions:", error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

// // Call the function to delete subscriptions
// deleteSubscriptions();

// // Call the function to drop the database
// dropDatabase();


async function truncateCollection(collectionName) {
 

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database
   
     const database = client.db("uprankly_dev");
    // Drop the collection
    await database.collection(collectionName).drop();

    console.log(`Collection "${collectionName}" truncated successfully.`);
  } catch (error) {
    console.error("Error truncating collection:", error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

// Call the function to truncate the collection
// truncateCollection("subscriptions");

dropDatabase("uprankly_dev");

