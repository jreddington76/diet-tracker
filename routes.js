const express = require('express');
const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');

const userService = require('./services/user.service');

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
  res.render('index', { data: data });
});

router.get('/favicon.ico', (req, res) => res.status(204));

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
], (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  res.render('login', {
    data: req.body,
    errors: errors.mapped()
  });
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
    const data = matchedData(req, { onlyValidData: false });
    console.log('Sanitized:', data);

    userService.addUser(data);

    req.flash('success', 'Thanks for the message! I‘ll be in touch :)');
    res.redirect('/');
  }
});

module.exports = router;