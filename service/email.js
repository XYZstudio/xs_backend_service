// Module
const co = require('co');
const nodemailer = require('@nodemailer/pro');
const config = require('../config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.email,
    pass: config.email.password
  }
});

module.exports = function(mailOptions) {
  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.error(err);
        reject();
      }
      resolve();
    });
  });
};