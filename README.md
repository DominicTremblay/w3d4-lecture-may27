# Lecture W3D4

## MongoDB

What is MongoDB?

- Document database that uses the JSON format for storing data

### Some key characteristics of MongoDB

- Design data models that make sense for the application:
  - efficiently supports common data access patterns
  - Storing multiple data in a single collection requires only one query (less joins than SQL)
- Designed to support agile software practices
- Scaling out: data can be replicated on several machines. it does not change anything for the app
- Mongo does not have tables. It can store all the data in a single document (flexible schema)
- It’s schema less (unless you use mongoose)
- With massive amount of unstructured data, having a well structured schema can be a hurdle
- Works more like folders that stores all kind of data
- Storing large volumes of data that often have little to no structure.
- Rapid development. More suitable for Agile development

### Mongo Shell

```sh
// list available database
show dbs

//switch databases
use [database name]

// Create a document
db.collection.insertOne({ “key”: value, “key”: value, “key”: value })

// Read from a collection
db.collection.find()
db.collection.find().pretty()
db.collection.find({ key: value })

//navigating through documents
var collection = db.collectionName.find()
collection.next()
collection.hasNext()
```

### Demo

We created a quotes App with express connected with Mongo. The quotes are generated dynamically using jQuery.

To start the app:

- clone this repo
- create a movieQuotes mongo database
- npm install
- npm start

[Curl commands](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58)
