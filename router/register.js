// Module
var koa = require('koa');
var router = require('koa-router')();
var nodemailer = require('@nodemailer/pro');
var app = koa();


// Config
const config = require('../config');

// Database
var Users = require('../database/users');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.email,
    pass: config.email.password
  }
});

// Route
router.post('/create_user', function*() {
  var req = this.request.body;
  var user = {
    email: req.email,
    name: req.name,
    password: req.password,
    status: 'active'
  };
  
  try {
    yield Users.create(user);
    // setup email data with unicode symbols
    var mailOptions = {
      from: '"Sporit" <no-reply@sporit.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Welcome to sporit, ' + user.name + '!', // Subject line
      html: '<b>Hello ' + user.name + ', you have registered in the sporit!</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        return console.error(err);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  } catch(e) {
    this.status(500);
  }

  this.body = user;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}
