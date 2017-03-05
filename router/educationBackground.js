// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var Educations = require('../database/schemas/educationBackground');
var Users = require('../database/schemas/users');

// Route

// update education by email
router.post('/update_user_education_background', function*() {
  console.log("[router.educationBackground] POST: update_user_education_background");
  var body = this.request.body;
  var user_name = body.userName;
  var user;
  
  try {
    user = yield Users.find({email: user_name});
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

  var education = {
    "userName":         body.userName,
    "schoolName":       body.schoolName, 
    "location":         body.location,
    "startYear":        body.startYear, 
    "startMonth":       body.startMonth, 
    "endYear":          body.endYear,
    "endMonth":         body.endMonth,
    "degree":           body.degree,
    "major":            body.major,
    "description":      body.description
  };

  var user_edu = yield Educations.findOne({userName: user_name});
  if( user_edu == null || body._id == null) {
    education = yield Educations.create(education);
  } else {
    education = yield Educations.update({userName: user_name}, education, {new: true});
    education.update = true;
  }
  

  this.body = education;
  return;
});

// get education by email
router.get('/get_user_education/:userName', function*() {
  console.log("[router.educationBackground] GET: get_user_education");
  const user_name = this.params.userName;
  var education;

  try {
    var user = yield Users.find({email: user_name});
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
  

  education = yield Educations.find({userName: user_name});

  if ( education == null ) {
    this.body = {};
    return;
  }

  this.body = education;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}