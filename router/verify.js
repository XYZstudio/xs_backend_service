// Module
const koa = require('koa');
const router = require('koa-router')();
const app = koa();
const config = require('../config');
const sendEmail = require('../service/email');
const genToken = require('../service/encrypt');
const Users = require('../database/schemas/users');

// Route
router.get('/verify/:token', function*() {
  const token = this.params.token;
  try {
    yield Users.update({ verify: token }, { status: 'active' });
  } catch(e) {
    console.error(e);
    this.status = 500;
  }

  this.status = 200;
});

router.get('/verify/:email/email', function*() {
  const email = this.params.email;
  try {
    const user = yield Users.findOne({ email: email });
    if (user) {
      const token = yield genToken(user.email, true);
      yield Users.update({ email: email }, { verify: token });
      const mailOptions = {
        from: '"Sporit" <no-reply@sporit.com>',
        to: user.email,
        subject: 'Welcome to sporit, ' + user.name + '!',
        html: '<p>Hello ' + user.name + ', here is your verification code:</p>' +
              '<p>Please copy and paste it into blank: ' + token
      };
      try {
        yield sendEmail(mailOptions);
      } catch(e) {
        // Ignore ...
      }
      this.body = {
        error: false,
        response: '验证码已发送',
      };
    } else {
      this.body = {
        error: true,
        response: '未找到与该邮箱相关的注册用户',
      };
    }
  } catch(e) {
    // Ignore ...
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}