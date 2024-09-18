import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import fs from 'fs';
import csv from 'csv-parser';



const app = express();
dotenv.config()
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());



const mongoURI = process.env.DATABASE_URL;

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


    {/* categories collection crud */ }
    app.get('/category', async (req, res) => {
      const results = await categoriesCollection.find().toArray();
      res.send(results);
    })
    // Add categories
    app.post('/category', async (req, res) => {
      const categories = [];

      fs.createReadStream('category.csv')
        .pipe(csv())
        .on('data', (data) => categories.push(data))
        .on('end', async () => {

          const results = await categoriesCollection.insertMany(categories);

          res.send(results);
        });
    })


    {/* niches collection crud */ }
    app.get('/niche', async (req, res) => {
      const result = await nichesCollection.find().toArray();
      res.send(result);
    });

    // add niches

    app.post('/niche', async (req, res) => {
      const niches = [];
      const updatedNiches = [];
      // const categoryName = []
      const categories = await categoriesCollection.find({}).toArray()
      // category finder
      const getCategoriesId = (name) => {
        const category = categories.find(item => item.name === name);
        return category
      }

      fs.createReadStream('niche.csv')
        .pipe(csv())
        .on('data', (data) => niches.push(data))
        .on('end', async () => {
          niches.map(item => {
            updatedNiches.push({ name: item?.name, categoryId: getCategoriesId(item.category)._id })
          })
          const results = await nichesCollection.insertMany(updatedNiches);
          // console.log(updatedNiches.length);
          res.send(updatedNiches);
        });
    })


    {/* sites collection crud */ }

    app.get('/site', async (req, res) => {
      const result = await sitesCollection.find().toArray();
      res.send(result);
    });

    // insert sites in db

    app.post('/site', async (req, res) => {
      const sites = [];

      fs.createReadStream('site.csv')
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



