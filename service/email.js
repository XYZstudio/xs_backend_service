// Module
const co = require('co');
const nodemailer = require('@nodemailer/pro');
const config = require('../config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: config.email.host,
    secureConnection: false,
    port: config.email.port,
    tls: {
      ciphers:'SSLv3'
    },
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