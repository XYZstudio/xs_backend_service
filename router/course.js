// Module
const koa = require('koa');
const router = require('koa-router')();
const config = require('../config');
const app = koa();
const Videos = require('../database/schemas/videos');
const Courses = require('../database/schemas/courses');
const Users = require('../database/schemas/users');

// Route

// Get all available courses
router.get('/get_all_courses', function*() {
  const email = this.params.email;
  var courses = [];
  
  try {
    courses = yield Courses.find({});
  } catch(e) {
    this.status = 500;
    return;
  }
  
  this.body = courses;
});

// if user email exists,
// then only get courses 
// that is available to that user
router.post('/get_courses', function*() {
  const email = this.request.body.email;
  var courses = [];
  
  try {
    var user = yield Users.findOne({ email: email, status: 'active' });
    var courseNames = user.course.map(c => c.courseName);
    courses = yield Courses.find({ name: { $in: courseNames } });
  } catch(e) {
    this.status = 500;
    return;
  }
  
  this.body = courses;
});

// Create courses with empty videos
router.post('/add_course', function*() {
  var req = this.request.body;
  var course = {
    name: req.name,
    description: req.description,
    image: req.image,
  };

  try {
    yield Courses.create(course);
  } catch(e) {
    this.status = 500;
    return;
  }

  this.statue = 200;
});

router.post('/add_video_to_course', function*() {
  var req = this.request.body;
  var video_name = req.video_name;
  var course_name = req.course_name;

  try {
    var course = yield Courses.find({ name: course_name });
    var video = yield Videos.find({ name: video_name });
    if(video.length == 1 && video.length == 1) {
      course[0].video.push(video[0]._id);
      Courses.update({ _id: course[0]._id }, course[0].toObject(), { new: true }, function(err, comment){
        if(err){
          console.error(err);
          return;
        }
      });
    } else{
      console.error('invalid course or video');
      this.body = {
        error: true,
        response: '视频名或课程名不正确',
      };
    }
  } catch(e) {
    console.error(e);
    this.status = 500;
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}