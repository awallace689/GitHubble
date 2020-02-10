var mongoClient = require('mongodb').MongoClient;
var secret = require('../secrets.mjs').connectString;


async function getAll(collection) {
  let client = await mongoClient.connect(secret, { useUnifiedTopology: true });
  let connection = client.db('GitHubble')
    .collection(collection);
  let result = await connection.find().toArray();

  client.close();
  return result;
}

module.exports = { getAll };