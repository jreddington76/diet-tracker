const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'james.reddington76@gmail.com',
    pass: 'yourpassword'
  }
});

const mailOptions = {
  from: 'james.reddington76@gmail.com',
  to: 'j.reddington@hotmail.co.uk',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

module.exports = (subject, body) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};