// Module
const koa = require('koa');
const router = require('koa-router')();
var multipart = require('co-multipart');
var app = koa();
var Resumes = require('../database/schemas/resume');
var Users = require('../database/schemas/users');
var ResumeId = require('../database/schemas/next_resume_id')
var fs = require("fs");
var path = require('path');

// Route

// update resume by email
router.post('/update_user_resume', function*() {
  console.log("[router.resume] POST: update_user_resume");
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

  var file = parts.file;
  var fileName = file.file.filename;
  var fileExtName = path.extname(fileName);
  var sourceFile = file.file.path;
  var ids = yield ResumeId.find();
  var resume_id = ids[0];
  if( resume_id == null ) {
    resume_id = {
      resume_id: 1
    }
    resume_id = yield ResumeId.create(resume_id);
  }

  var targetFile = __dirname + "/../resumes/" + resume_id.resume_id + fileExtName;

  resume_id.resume_id = resume_id.resume_id + 1;
  yield ResumeId.update({_id: resume_id._id},  resume_id, {new: true});

  var source = fs.createReadStream(sourceFile);
  var dest = fs.createWriteStream(targetFile);

  source.pipe(dest);
  source.on('error', function(err) { 
    this.body = {
      error: true,
      response: "Upload file fails. "
    }
   });

  var resume = {
    userName: user_name,
    userId:   parts.field.userId,
    fileName: fileName,
    path:     targetFile
  }

  var user_resume = yield Resumes.findOne({userName: user_name});
  if( user_resume == null ) {
    resume = yield Resumes.create(resume);
  } else {
    try {
      if(fs.existsSync(user_resume.path)) {
        fs.unlinkSync(user_resume.path)
      }
    } catch(e) {
      console.log(e);
    }
    resume = yield Resumes.update({userName: user_name}, resume, {new: true});
    resume.update = true;
  }
  
  parts.dispose();

  this.body = resume;
});

// download resume by email
router.get('/download_user_resume/:userName', function*() {
  console.log("[router.resume] GET: download_user_resume");
  const user_name = this.params.userName;

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
  
 
  var resume = yield Resumes.findOne({userName: user_name});

  if ( resume == null ) {
    this.body = {
      error: true,
      response: "Cannot find resume"
    };
    return;
  }

  this.set('Content-disposition', 'attachment; filename=' + resume.fileName);
  this.attachment(resume.fileName);
  this.body = fs.createReadStream(resume.path);

});


// get resume name by email
router.get('/get_user_resume_name/:userName', function*() {
  console.log("[router.resume] GET: get_user_resume_name");
  const user_name = this.params.userName;

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
  
 
  var resume = yield Resumes.findOne({userName: user_name});

  if ( resume == null ) {
    this.body = {
      error: true,
      response: "Cannot find resume"
    };
    return;
  }
  console.log(resume);
  this.body = {
    fileName : resume.fileName,
    filePath : resume.path
  }
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}