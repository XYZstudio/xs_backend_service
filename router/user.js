// Module
var koa = require('koa');
var router = require('koa-router')();
const genToken = require('../service/encrypt');
var app = koa();
const config = require('../config');
var Users = require('../database/schemas/users');
var Courses = require('../database/schemas/course');

// Route
router.post('/add_course_to_user_by_name', function*() {
  console.log("add course to user");
  var req = this.request.body;
  var course_name = req.course_name;
  var user_name = req.user_name;
  try {
    var course = yield Courses.find({"name": course_name});
    var user = yield Users.find({"name": user_name});
    if( course.length == 1 && user.length == 1) {
      user[0].course.push(course[0]._id);
      Users.update({_id: user[0]._id}, user[0].toObject(), {new: true}, function(err, comment){
        if(err){
          console.log(err);
          this.status = 500;
          return;
        }
      });
    } else{
      console.log("invalid user or course");
    }
    //console.log(hw[0].title);
  } catch(e) {
    console.log(e);
  }
});

router.post('/reset_password', function*() {
  const body = this.request.body;
  var user = null;

  try {
    const newToken = yield genToken(body.password);
    user = yield Users.findOne({ email: body.email, verify: body.token });
    if (user) {
      yield Users.update({ email: body.email, verify: body.token }, { password: newToken });
    } else {
      this.body = {
        error: true,
        message: '更新失败，请检查验证码是否正确'
      };
      return;  
    }
  } catch(e) {
    console.error(err);
    this.status = 500;
  }

  this.body = {
    error: false,
    message: '成功更新了密码',
    user: user,
  };
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}