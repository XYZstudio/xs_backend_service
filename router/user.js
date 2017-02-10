// Module
const koa = require('koa');
const router = require('koa-router')();
const _ = require('underscore');
const config = require('../config');
const genToken = require('../service/encrypt');
const app = koa();
const Users = require('../database/schemas/users');
const Courses = require('../database/schemas/courses');

// Route

// Update multiple course name into Users
// and return the updated user data
router.post('/add_course_to_user', function*() {
  var req = this.request.body;
  var courseNames = req.courseNames;
  var email = req.email;

  try {
    // update users' courses
    var existedCourses = yield Users.findOne({ email: email });
    existedCourses = existedCourses.course.map(c => c.courseName);
    courseNames = _.difference(courseNames, existedCourses).map((n) => { return { courseName: n } });

    if (courseNames.length === 0) {
      this.body = {
        error: true,
        response: '所选课程已经存在于用户的课单',
      };
      return;
    }

    yield Users.update({ email: email }, {
      $addToSet: {
        course: { $each: courseNames }
      }
    });

    // get updated user data
    this.body = yield Users.findOne({ email: email });
    return;
  } catch(e) {
    this.status = 500;
    this.body = {
      error: true,
      response: '用户名或课程名不正确',
    };
    return;
  }
});

// Reset and update user's password
// if the verification token and user email matches
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