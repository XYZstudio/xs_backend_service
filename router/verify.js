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
        subject: '思博锐体育会员密码重置',
        html: '<div style="width: 100%; border-bottom: 3px solid lightskyblue; margin-bottom: 35px;">' +
                `<img src='https://s15.postimg.org/i4hcero8b/logo.png' style="width: 100px;" />` +
              '</div>' +
              '<div>' +
                `<b>亲爱的 ${user.name}, </b>` +
                '<p>您已成功发送了重置密码的请求，只需最后三步即可重置你的密码：</p>' +
                '<div style="background-color: #f1f1f1; margin: 20px; padding: 10px; border-radius: 10px">' +
                  '<ul style="list-style: none;">' +
                    `<li>第一步：复制以下代码：<b>${token}</b></li>` +
                    `<li>第二步：将代码黏贴至‘黏贴验证码’中</li>` +
                    `<li>第三步：点击‘确认‘</li>` +
                    `<li>密码重置成功！</li>` +
                  '</ul>' +
                '</div>' +
              '</div>' +
              '<div style="padding: 15px; margin-top: 35px; width: 100%; border-top: 3px solid lightskyblue;">' +
                '<p style="font-style: italic; color: dimgrey;">' +
                  '思博锐（SPORiT）始于哥伦比亚大学体育管理专业，' +
                  '是一批具有优秀专业素养的青年携手国内外体育产业知名专家创立的国际化体育精英人才交流平台。' +
                  '思博锐以中国的体育事业发展为己任，致力于为中国体育管理人才缺失的问题提供综合解决方案，为中国体育产业管理不断注入新鲜血液。' +
                  '努力建设中国体育管理精英联盟，共同推进中国体育发展！' +
                '</p>' +
              '</div>'
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