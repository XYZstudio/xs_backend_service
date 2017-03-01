// Module
const koa = require('koa');
const router = require('koa-router')();
const app = koa();
const sendEmail = require('../service/email');
const genToken = require('../service/encrypt');
const config = require('../config');
var Users = require('../database/schemas/users');

// Route
router.post('/create_user', function*() {
  console.log('register!');
  console.log(this.request.body);
  var req = this.request.body;
  var token = yield genToken(req.email);
  var user = {
    email: req.email,
    name: req.name,
    password: req.password,
    status: 'inactive',
    verify: token,
  };

  try {
    console.log('Checking exsiting user ...');
    var existingUser = yield Users.find({ email: req.email });

    //Email already existed but not verified
    if (existingUser.length > 0 && existingUser[0].status == 'inactive') {
      console.log("Email already register but not verify");
      this.body = {
        warning: 'Email already register but not verified',
        create: false
      };
      this.status = 500;
      return;
    }
    
    //User already existed
    if (existingUser.length > 0 && existingUser[0].status == 'active') {
      console.log('User already exsited!');
      this.body = {
        warning: 'The user already exists',
        create: false
      };
      this.status = 500;
      return;
    } else {
      console.log('Creating user...');
      yield Users.create(user);
    }
  } catch(e) {
    console.log("Exception caught during register!");
    this.body = {
      warning: 'Unknown internal Error',
      create: false
    };
    this.status = 500;
  }

  try {
    console.log('Sending email...');
    var mailOptions = {
      from: '"Sporit" <no-reply@sporit.com>',
      to: user.email,
      subject: 'Welcome to sporit, ' + user.name + '!',
      html: '<b>Hello ' + user.name + ', you have registered in the sporit!</b>' +
            '<p>Here is one last step to finish your registeration, please click' +
            'the link below to verify the email:</p><a href=' + config.verify_link + token + '>' +
            'Click Here To Verify</a>'
    };
    yield sendEmail(mailOptions);
    console.log('Email sent.');
  } catch(e) {
    // Ignore ...
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
