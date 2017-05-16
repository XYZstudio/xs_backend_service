// Module
const fs = require('fs');
const koa = require('koa');
const router = require('koa-router')();
const config = require('../config');
const app = koa();
const Users = require('../database/schemas/users');
const Courses = require('../database/schemas/courses');
const Videos = require('../database/schemas/videos');

// Route
// Get Course info by name
router.get('/get_course/:course_name', function*() {
  console.log("course name :" + this.params.course_name);
  const course_name = this.params.course_name;
  var course;
  var videos;
  var preview;
  try {
    course = yield Courses.findOne({ name: course_name });
    video_names = course.video.map(c => c.videoName);
    videos = yield Videos.find({ name: { $in: video_names } });
    preview = videos.filter((v) => { return v.preview; })[0];
    videos = videos.filter((v) => { return !v.preview; }).sort((a, b) => { return a.order - b.order });
  } catch(e) {
    this.status = 500;
    return;
  }

  this.body = {
    course: course,
    videos: videos,
    preview: preview,
  };
});

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

// Get Course info by video name
router.get('/get_course_by_video_name/:video_name', function*() {
  console.log("[router.course] GET: get_course_by_video_name");
  var video_name = this.params.video_name;
  var course;
  try {
    course = yield Courses.findOne({ 'video.videoName': video_name });
  } catch(e) {
    console.error(e);
    this.message = {
      error: true,
      message: "未找到该课程"
    };
    return;
  }

  this.body = course;
});

router.get('/preview/:video_name', function*() {
  console.log("[router.course] GET: preview");
  const video_name = this.params.video_name;
  let video;
  try {
    video = yield Videos.findOne({ "name": video_name });
  } catch(e) {
    console.error(e);
    this.body = {
      error: true,
      message: "视频播放错误"
    }
    return;
  }
  if (!video.preview) {
    this.body = {
      error: true,
      message: "没有权限观看此视频"
    }
    return;
  }
  var file = video.video_path;
  var headers = this.headers;
  var range;
  var positions;
  var start;
  var file_size;
  var end;
  var chunksize;
  var stream_position;

  if (!fs.existsSync(file)) {
    this.body = {
      error: true,
      message: "不存在该视频"
    }
  }

  range = headers.range;
    
  if(!range) {
    this.status = 416;
    this.body = {
      error: true,
      message: "视频播放错误"
    }
    return;
  }

  var stats = fs.statSync(file);
  positions = range.replace(/bytes=/, "").split("-");
  start = parseInt(positions[0], 10);
  file_size = stats.size;
  end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
  chunksize = (end - start) + 1;
  stream_position = {
    start: start,
    end: end
  };

  this.set("Content-Range", "bytes " + start + "-" + end + "/" + file_size);
  this.set("Accept-Ranges", "bytes");
  this.set("Content-Length", chunksize);
  this.set("Content-Type", "video/mp4");
  this.status = 206;
  this.body = fs.createReadStream(file, stream_position);
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}