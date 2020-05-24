const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017/";
const databaseName = "diet-tracker";

let db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, database) => {
  if (err) throw err;

  db = database.db(databaseName);
});

module.exports = {
  getUsers: () => db.collection('users'),
  addUser: (user) => {
    try {
      db.collection('users').insertOne(user);
    } catch (e) {
      console.log(e);
    }
  },
  addUsers: (users) => {
    try {
      db.collection('users').insertMany(users);
    } catch (e) {
      console.log(e);
    }
  }
};