const express = require('express');
const morgan = require('morgan');
const Mongo = require('mongodb');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 8000;
const app = express();
const MongoClient = Mongo.MongoClient;

// URI to the mongoDB that we are using
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieQuotes';

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

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

// Sends back the list of quotes as json
app.get('/quotes', (req, res) => {
  db.collection('quotes')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => {
      console.log('Error:', err);
      process.exit(1);
    });
});

// get a single quote
app.get('/quotes/:id', (req, res) => {
  // extract the id from params
  const { id } = req.params;

  // find the quote with that id in the db
  db.collection('quotes')
    .findOne({ _id: ObjectID(id) })
    // sends back the quote as json
    .then(quote => res.json(quote))
    .catch(err => res.send(err));
});

app.post('/quotes', (req, res) => {
  // extract the content from the body of the request
  const { quoteContent } = req.body;

  // save the quote in the database
  db.collection('quotes')
    .insertOne({ quote: quoteContent, comments: [] })
    .then(result => {
      // result.ops[0]._id gets us the id that has been created in the db
      console.log(result.ops[0]._id);
      // sending back the new quote
      res.send({
        _id: result.ops[0]._id,
        quote: quoteContent,
        comments: [],
      });
    })
    .catch(err => console.log('Error:', err));
});

// Update one quote (Edit)
app.put('/quotes/:id', (req, res) => {
  const { quoteContent } = req.body;
  const { id } = req.params;

  db.collection('quotes')
    .updateOne({ _id: ObjectID(id) }, { $set: { quote: quoteContent } })
    .then(result => res.send(quoteContent))
    .catch(err => console.log(`Error: ${err}`));
});

// Delete one quote
app.delete('/quotes/:id', (req, res) => {
  console.log('DELETE...');
  const { id } = req.params;

  db.collection('quotes')
    .deleteOne({ _id: ObjectID(id) })
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
