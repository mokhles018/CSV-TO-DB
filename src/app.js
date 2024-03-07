import express from "express";
import { connectToDatabase } from "./utils/database";

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// connect to database 
connectToDatabase(); 


// Define your routes and API endpoints here
app.get('/', (req, res) => {
  res.send('Welcome to the Links Monitoring App!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 