var client = require('mongodb').MongoClient;
var secret = require('../secrets.mjs').connectString;


function getAll(collection, res) {
  client.connect(secret, function (err, dbInstance) {
    if (err) {
      throw err;
    }
    else {
      const dbObject = dbInstance.db('GitHubble');
      const dbCollection = dbObject.collection(collection);

      dbCollection.find().toArray((error, result) => {
        if (error) {
          throw error;
        }
        res.status(200).json(result);
      });
    }
  });
}

module.exports =  { getAll };