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
    var existingUser = yield Users.find({ email: req.email });
    if (existingUser.length > 0) {
      this.body = {
        warning: 'The user already exists',
        create: false
      };
      return;
    } else {
      yield Users.create(user);
    }
  } catch(e) {
    this.status = 500;
  }
  
  try {
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
