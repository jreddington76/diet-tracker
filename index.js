const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const { MongoClient } = require('mongodb');
const routes = require('./routes');

const url = "mongodb://localhost:27017/";

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const middlewares = [
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash()
];

app.use(middlewares);

app.use('/', routes);
app.use('/users', routes);
app.use('/login', routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let db;

MongoClient.connect(url, (err, database) => {
  if (err) throw err;

  db = database.db("diet-tracker");
  var cursor = db.collection('users').find();

  cursor.each(function (err, doc) {

    console.log(doc);

  });
});

app.listen(4242, () => {
  console.log('Express Server is running...');
});