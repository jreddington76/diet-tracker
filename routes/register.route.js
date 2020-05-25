const router = require('express').Router;
const { check, validationResult, matchedData } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const userService = require('./services/user.service');


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
    console.log('Sanitized:', user);

    userService.addUser(data);

    req.flash('success', 'You have successfully registered');
    res.redirect('/login');
  }
});

module.exports = router;