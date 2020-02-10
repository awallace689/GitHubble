var mongoClient = require('mongodb').MongoClient;
var secret = require('../secrets.mjs').connectString;


const dbName = 'GitHubble';

async function getAll(collection) {
  let client = await mongoClient.connect(secret, { useUnifiedTopology: true });
  let connection = client.db(dbName)
    .collection(collection);
  let result = await connection.find().toArray();

  client.close();
  return result;
}

async function getOne(collection, identifier) {
  let client = await mongoClient.connect(secret, { useUnifiedTopology: true });
  let connection = client.db(dbName)
    .collection(collection);
  let result = await connection.findOne(identifier).toArray();

  client.close()
  return result;
}

async function insertOne(collection, document) {
  let client = await mongoClient.connect(secret, { useUnifiedTopology: true });
  let connection = client.db(dbName)
    .collection(collection);
  let result = await connection.insertOne(document);

  client.close();
  return result;
}

async function insertMany(collection, documentArr) {
  let client = await mongoClient.connect(secret, { useUnifiedTopology: true });
  let connection = client.db(dbName)
    .collection(collection);
  let result = await connection.insertMany(documentArr);

  client.close();
  return result;
}

module.exports = { 
  getAll, 
  getOne, 
  insertOne, 
  insertMany 
};