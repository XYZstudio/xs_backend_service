// Module
const koa = require('koa');
const router = require('koa-router')();
const app = koa();
const sendEmail = require('../service/email');
const genToken = require('../service/encrypt');
const config = require('../config');
var Users = require('../database/schemas/users');
var BasicInfos = require('../database/schemas/basicInfo');

// Route
router.post('/create_user', function*() {
  console.log("[router.register] POST: create_user");
  var req = this.request.body;
  var password = yield genToken(req.password, false);
  var token = yield genToken(req.email, true);
  var user = {
    email: req.email,
    name: req.name,
    password: password,
    status: 'inactive',
    verify: token,
    lastActivity: {
      courseName: '',
      videoName: '',
      time: 0
    },
    course: []
  };
  var matchInnerKey = req.inner_key && req.inner_key === config.inner_key;

  if (matchInnerKey) {
    user.status = 'active';
  }

  try {
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
      //create new user
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
    var mailOptions = {
      from: config.email.email,
      to: user.email,
      subject: '思博锐体育会员注册激活',
      html: '<div style="width: 100%; border-bottom: 3px solid lightskyblue; margin-bottom: 35px;">' +
              `<img src='https://s15.postimg.org/i4hcero8b/logo.png' style="width: 100px;" />` +
            '</div>' +
            '<div>' +
              `<b>亲爱的 ${user.name}, </b>` +
              '<p>非常感谢您注册加入思博锐（SPORiT），成为我们尊贵的会员！</p>' +
              `<p>点击<a href='${config.verify_link}${token}'>激活链接</a>，即可激活会员身份，拥有会员专享课程、独家求职资讯、线下精彩活动动态！</p>` +
              '<div style="background-color: #f1f1f1; margin: 20px; padding: 10px; border-radius: 10px">' +
                '<ul style="list-style: none;">' +
                  `<li>姓名：${user.name}</li>` +
                  `<li>邮箱地址：${req.email}</li>` +
                  `<li>账号：${req.email}</li>` +
                  `<li>密码：${req.password}</li>` +
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
    if (!matchInnerKey) {
      yield sendEmail(mailOptions);
    }
  } catch(e) {
    // Ignore ...
  }

  this.body = yield Users.find({ email: req.email });;
});

router.post('/create_user_basic_info_by_id', function*() {
  console.log("[router.register] POST: create_user_basic_info_by_id");
  var body = this.request.body;
  var user_id = body.userId;
  var user;
  
  try {
    user = yield Users.findOne({_id: user_id});
  } catch(e) {
    this.status = 500;
    return;
  }

  var basicInfo = {
    "userId":           user_id,
    "userName":         body.userName,
    "firstName":        body.firstName,
    "lastName":         body.lastName, 
    "currentStatus":    body.currentStatus,
    "gender":           body.gender,
    "birthYear":        body.birthYear,
    "birthMonth":       body.birthMonth,
    "birthDate":        body.birthDate,
    "highestDegree":    body.highestDegree,
    "careerDomain":     body.careerDomain,
    "hobbies":          body.hobbies
  };

  try {
    let basicInfoExists = yield BasicInfos.count({ userId: user_id });
    if (basicInfoExists) {
      this.body = {
        error: true,
        message: "无权更新已有用户信息"
      };
      return;
    }
    basicInfo = yield BasicInfos.create(basicInfo);
  } catch(e) {
    console.error(e);
    this.status = 500;
    return;
  }

  this.body = basicInfo;
  return;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}
