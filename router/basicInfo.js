// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var BasicInfos = require('../database/schemas/basicInfo');
var Users = require('../database/schemas/users');

// Route

// update basic information by email
router.post('/update_user_basic_info_by_id', function*() {
  console.log("[router.basicInfo] POST: update_user_basic_info_by_id");
  var body = this.request.body;
  var user_id = body.userId;
  var user;
  
  try {
    user = yield Users.findOne({_id: user_id});
    if( user == null || user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
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

  var user_contact = yield BasicInfos.findOne({userId: user_id});
  if( user_contact == null ) {
    basicInfo = yield BasicInfos.create(basicInfo);
  } else {
    basicInfo = yield BasicInfos.update({userId: user_id}, basicInfo, {new: true});
    basicInfo.update = true;
  }
  

  this.body = basicInfo;
  return;
});

// get basic information by user id
router.get('/get_user_basic_info_by_id/:userId', function*() {
  console.log("[router.basicInfo] GET: get_user_basic_info_by_id");
  const user_id = this.params.userId;
  var contact;

  try {
    var user = yield Users.find({_id: user_id});
    if( user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
  } catch(e) {
    this.status = 500;
    return;
  }
  

  basicInfo = yield BasicInfos.findOne({userId: user_id});

  if ( basicInfo == null ) {
    this.body = {};
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