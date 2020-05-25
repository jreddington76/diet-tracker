const { MongoClient } = require('mongodb');
const bcrypt = require("bcrypt");

const url = "mongodb://localhost:27017/";
const databaseName = "diet-tracker";
const saltRounds = 10;

let db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, database) => {
  if (err) throw err;

  db = database.db(databaseName);
});

module.exports = {
  getUsers: () => db.collection('users'),

  getUser: (emailAddress, password, callback) => {
    try {
      const query = {
        emailAddress: emailAddress
      };

      db.collection('users').findOne(query)
        .then(user => {
          if (!user) {
            callback(null);
          }

          bcrypt.compare(password, user.password)
            .then((result) => {
              callback(result ? user : null);
            });
        });
    } catch (e) {
      console.log(e);
    }
  },

  addUser: async (user) => {
    try {
      await bcrypt.hash(user.password, saltRounds, (error, hash) => {
        user.password = hash;
        db.collection('users').insertOne(user);
      });
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