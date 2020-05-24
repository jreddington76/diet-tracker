const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017/";
const database = "diet-tracker";

let db;

MongoClient.connect(url, (err, database) => {
  if (err) throw err;

  db = database.db(database);
});

module.exports = db;