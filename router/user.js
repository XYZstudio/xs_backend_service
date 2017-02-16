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

// Update last user activity
router.post('/update_last_activity', function*() {
  const body = this.request.body;
  var email = body.email;
  var lastActivity = {
    courseName: body.courseName,
    videoName: body.videoName,
    time: body.time
  };

  try {
    yield Users.update({ email: email }, { lastActivity: lastActivity });
    this.body = {
      error: false,
      message: '成功更新了最后活动'
    };
    return;
  } catch(e) {
    this.body = {
      error: true,
      message: '更新失败，请检查所更新的最后活动'
    };
    return;
  }
});

// update finished video list of the course which the user has
router.post('/update_finished_video_to_user', function*() {
  const body = this.request.body;
  var email = body.email;
  var video_name = body.videoName;
  var course_name = body.courseName;
  
  var user = yield Users.findOne({ email: email });
  if( user != null) {
    var user_courses = user.course;
    for(var i = 0; i < user_courses.length; i ++) {
      var course = user_courses[i];
      if( course.courseName == course_name ) {
        for( var j = 0; j < course.finished.length; j ++) {
          if(video_name == course.finished[j].videoName ) {
            this.body = {
              error: true,
              response: "该同学已完成该视频"
            };
            return;
          }
        }
        var temp_course = yield Courses.findOne({ name: course_name });
        for( var j = 0; j < temp_course.video.length; j ++) {
          if(video_name == temp_course.video[j].videoName ) {
            user_courses[i].finished.push({ videoName: video_name});
            yield Users.update({ email: email }, {
                course: user_courses 
            });
            this.body = user;
            return;
          }
        }

      }
    }
  } else {
    this.body = {
      error: true,
      response: "找不到用户"
    };
    return;
  }
  this.body = {
    error: true,
    response: "找不到视频或课程"
  };
  return;

});

// if the user exists, return the completed video of specified course
router.post('/get_finished_videos_of_course', function*() {
  const body = this.request.body;
  var course_name = body.courseName;
  var email = body.email;
  var finished = [];
  var user = yield Users.findOne({ email: email });
  if( user != null) {
    var user_courses = user.course;
    for(var i = 0; i < user_courses.length; i ++) {
      var course = user_courses[i];
      if( course.courseName == course_name ) {
        finished = course.finished;
        this.body = finished;
        return;
      }
    } 
    this.body = {
      error: true, 
      response: "找不到课程"
    }
    return;
  } else {
    this.body = {
      error: true, 
      response: "找不到用户"
    }
    return;
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}