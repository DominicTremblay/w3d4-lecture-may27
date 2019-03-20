const express = require('express');
const morgan = require('morgan');
const Mongo = require('mongodb');

const port = process.env.PORT || 8000;
const app = express();
const MongoClient = Mongo.MongoClient;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieQuotes';

app.use(morgan('dev'));
app.use(express.static('public'));

let db = null;

// Establish connection to the mongo db and assign the mongoDb object to db
MongoClient.connect(MONGODB_URI, (err, mongoDb) => {
  if (err) {
    console.log('Cannot connect to MongoDB:', err);
    process.exit(1);
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  db = mongoDb;
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
