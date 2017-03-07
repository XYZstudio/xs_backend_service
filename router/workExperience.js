// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var WorkExperiences = require('../database/schemas/workExperience');
var Users = require('../database/schemas/users');

// Route

// update work experience by email
router.post('/update_user_work_experience', function*() {
  console.log("[router.workExperience] POST: update_user_work_experience");
  var body = this.request.body;
  var user_name = body.userName;
  var user;
  
  try {
    user = yield Users.find({email: user_name});
    if( user.length < 1 ) {
      console.log('update_user_work_experience: user not exsited!');
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

  var workExp = {
    "userName":         body.userName,
    "companyName":      body.companyName, 
    "title":            body.title,
    "location":         body.location,
    "startYear":        body.startYear, 
    "startMonth":       body.startMonth, 
    "endYear":          body.endYear,
    "endMonth":         body.endMonth,
    "description":      body.description
  };

  var user_workExp = yield WorkExperiences.findOne({userName: user_name});
  if( user_workExp == null || body._id == null) {
    console.log('update_user_work_experience: create new work experience!');
    console.log(workExp);
    workExp = yield WorkExperiences.create(workExp);
  } else {
    console.log('update_user_work_experience: update old work experience!');
    console.log(workExp);
    workExp = yield WorkExperiences.update({_id: body._id}, workExp, {new: true});
    workExp.update = true;
  }
  
  this.body = workExp;
  return;
});

// get work experience by email
router.get('/get_user_work_experience/:userName', function*() {
  console.log("[router.workExperience] GET: get_user_work_experience");
  const user_name = this.params.userName;
  var workExp;

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
  

  workExp = yield WorkExperiences.find({userName: user_name});

  if ( workExp == null ) {
    this.body = {};
    return;
  }

  this.body = workExp;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}