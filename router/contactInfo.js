// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var ContactInfos = require('../database/schemas/contactInfo');
var Users = require('../database/schemas/users');

// Route

// update contact information by email
router.post('/update_user_contact', function*() {
  console.log("[router.contactInfo] POST: update_user_contact");
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

  var intro = {
    "userName":         user_name,
    "firstName":        body.firstName, 
    "lastName":         body.lastName,
    "email":            body.email,
    "address":          body.address, 
    "country":          body.country,
    "zipcode":          body.zipcode,
    "cellPhone":        body.cellPhone,
    "mobile":           body.mobile
  };

  var user_intro = yield ContactInfos.findOne({userName: user_name});
  if( user_intro == null ) {
    yield ContactInfos.create(intro);
  } else {
    yield ContactInfos.update({userName: user_name}, intro, {new: true});
  }
  

  this.body = intro;
  return;
});

// get contact information by email
router.get('/get_user_contact/:userName', function*() {
  console.log("[router.contactInfo] GET: get_user_contact");
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
  

  intro = yield ContactInfos.findOne({userName: user_name});

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