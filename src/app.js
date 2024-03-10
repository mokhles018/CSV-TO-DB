import express from "express";
import { MongoClient } from "mongodb";
import fs from 'fs';
import csv from 'csv-parser';



const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());



const mongoURI = 'mongodb+srv://kashem:dFP0NhtOblDuEGJt@cluster0.hmmua.mongodb.net/uprankly_dev';

const client = new MongoClient(mongoURI);

async function connectToDatabase() {
  try {
    await client.connect();
    const categoriesCollection = client.db('uprankly_dev').collection('categories');
    const nichesCollection = client.db('uprankly_dev').collection('niches');
    const sitesCollection = client.db('uprankly_dev').collection('sites');



    app.get('/', (req, res) => {
      res.send('Hello uprankly')
    });


    {/* categories collection crud */}
    app.get('/categories', async (req, res) => {
      const results = await categoriesCollection.find().toArray();
      res.send(results);
    })
    // Add categories
    app.post('/categories', async (req, res) => {
      const categories = [];

      fs.createReadStream('categories.csv')
        .pipe(csv())
        .on('data', (data) => categories.push(data))
        .on('end', async () => {

          const results = await categoriesCollection.insertMany(categories);

          res.send(results);
          console.log(results);
        });
    })


    {/* niches collection crud */}
    app.get('/niches', async (req, res) => {
      const result = await nichesCollection.find().toArray();
      res.send(result);
    });

    // add niches

    app.post('/niches', async (req, res) => {
      const niches = [];

      fs.createReadStream('niches.csv')
        .pipe(csv())
        .on('data', (data) => niches.push(data))
        .on('end', async () => {
          console.log(niches);
          const results = await nichesCollection.insertMany(niches);

          res.send(results);
          console.log(results);
        });
    })

    {/* sites collection crud */}

    app.get('/sites', async (req, res) => {
      const result = await sitesCollection.find().toArray();
      res.send(result);
    });

    // insert sites in db

    app.post('/sites', async (req, res) => {
      const sites = [];

      fs.createReadStream('sites.csv')
        .pipe(csv())
        .on('data', (data) => sites.push(data))
        .on('end', async () => {
          const convertedData = sites.map(site => ({
            ...site,
            mozDA: parseInt(site.mozDA),
            mozPA: parseInt(site.mozPA),
            srTraffic: parseInt(site.srTraffic),
            nicheIds: [site.nicheIds],
            lastUpdatedAt: new Date()
          }));
          const results = await sitesCollection.insertMany(convertedData);
          console.log(results)

          res.send(results);
        });
    })

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });


  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.send('Hello uprankly');
})



