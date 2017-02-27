// Module
const koa = require('koa');
const router = require('koa-router')();
var multipart = require('co-multipart')
var app = koa();
var Resumes = require('../database/schemas/resume');
var Users = require('../database/schemas/users');
var fs = require("fs");

// Route

// update resume by email
router.post('/update_user_resume', function*() {
  console.log("[router.resume] POST: update_user_resume");
  var body = this.request.body;
  var parts = yield* multipart(this);
  
  var user_name = parts.field.userName;
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
  //console.log(parts.file);
  var file = parts.file;
  var fileName = file.file.filename;
  var sourceFile = file.file.path;
  var targetFile = __dirname + "/../resumes/" + fileName;

  fs.renameSync(sourceFile, targetFile, function(err) {
    if(err) {
      this.body = err;
      return;
    }
  });

  var resume = {
    userName: user_name,
    path:     targetFile
  }

  var user_resume = yield Resumes.findOne({userName: user_name});
  if( user_resume == null ) {
    yield Resumes.create(resume);
  } else {
    yield Resumes.update({userName: user_name}, resume, {new: true});
  }
  
  parts.dispose();

  this.body = resume;
});

// get introduction by email
router.get('/get_user_resume/:userName', function*() {
  console.log("[router.resume] GET: get_user_resume");
  const user_name = this.params.userName;
  var intro;

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
  

  intro = yield Introductions.findOne({userName: user_name});

  if ( intro == null ) {
    this.body = {};
    return;
  }

  this.body = intro;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}