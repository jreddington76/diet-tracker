const express = require('express');
const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = require('../middleware/auth');
const userService = require('../services/user.service');

const options = [
  'coffee',
  'water',
  'diet coke'
];

const data = {
  loggedIn: true,
  username: 'James',
  drinks: options
};

router.get('/', (req, res) => {
  res.render('home', { data: data });
});

router.get('/favicon.ico', (req, res) => res.status(204));

router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard');
});


router.get('/register', (req, res) => {
  res.render('register', {
    data: {},
    errors: {}
  });
});

router.post('/register', [
  check('emailAddress')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .bail()
    .trim()
    .normalizeEmail(),
  check('lastname')
    .isLength({ min: 1 })
    .withMessage('Last name is required')
    .trim(),
  check('firstname')
    .isLength({ min: 1 })
    .withMessage('First name is required')
    .trim(),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password does not meet criteria')
  // check('termsAgreed')
  //   .isBoolean()
  //   .withMessage('You must agree to Terms and Conditions')
], (req, res) => {
  const errors = validationResult(req);

  if (!errors) {
    res.render('register', {
      data: req.body,
      errors: errors.mapped()
    });
  } else {
    const user = matchedData(req, { onlyValidData: false });
    user._id = uuidv4();

    userService.addUser(user);

    req.flash('success', 'You have successfully registered');
    res.redirect('/login');
  }
});


router.get('/login', (req, res) => {
  res.render('login', {
    data: {},
    errors: {}
  });
});

router.post('/login', [
  check('emailAddress')
    .isEmail()
    .withMessage('That email doesn‘t look right'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password does not meet criteria')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors) {
    res.render('login', {
      data: req.body,
      errors: errors.mapped()
    });
  } else {
    userService.getUser(req.body.emailAddress, req.body.password, (user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      const token = jwt.sign({ _id: this._id, isAdmin: true }, config.get('myprivatekey'));

      res.header("x-auth-token", token).send({
        _id: user._id,
        email: user.emailAddress
      });
    });
  }
});

module.exports = router;