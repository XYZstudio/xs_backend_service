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

  var contact = {
    "userName":         user_name,
    "email":            body.email,
    "address":          body.address, 
    "city":             body.city,
    "province":         body.province,
    "zipcode":          body.zipcode,
    "cellPhone":        body.cellPhone,
    "mobile":           body.mobile
  };

  var user_contact = yield ContactInfos.findOne({userName: user_name});
  if( user_contact == null ) {
    contact = yield ContactInfos.create(contact);
  } else {
    contact = yield ContactInfos.update({userName: user_name}, contact, {new: true});
    contact.update = true;
  }
  

  this.body = contact;
  return;
});

// get contact information by email
router.get('/get_user_contact/:userName', function*() {
  console.log("[router.contactInfo] GET: get_user_contact");
  const user_name = this.params.userName;
  var contact;

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
  

  contact = yield ContactInfos.findOne({userName: user_name});

  if ( contact == null ) {
    this.body = {};
    return;
  }

  this.body = contact;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}