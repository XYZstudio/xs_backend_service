// Module
const koa = require('koa');
const router = require('koa-router')();
const _ = require('underscore');
var app = koa();
var fs = require("fs")
var path = require("path");
var Courses = require('../database/schemas/courses');
var Videos = require('../database/schemas/videos');

// Route
router.get('/get_video/:video_name', function*() {
  console.log("[router.video] GET: get_video");
  const video_name = this.params.video_name;
  try {
    let video = yield Videos.findOne({ name: video_name });
    this.body = video;
    return;
  } catch(e) {
    console.error(e);
    this.body = {
      error: true,
      message: "不存在该视频的信息"
    };
    return;
  }
});

router.get('/display/:video_name', function*() {
  console.log("[router.video] GET: display");
  const video_name = this.params.video_name;
  const purchased_courses = this.req.user.course.map(c => c.courseName);
  let video;
  try {
    let courses = yield Courses.find({ name: { $in: purchased_courses } });
    let purchased_videos = _.flatten(courses.map(c => c.video)).map(v => v.videoName);
    if (!_.contains(purchased_videos, video_name)) {
      this.body = {
        error: true,
        message: "没有权限观看此视频"
      }
      return;
    }
    video = yield Videos.findOne({"name": video_name});
  } catch(e) {
    console.error(e);
    this.body = {
      error: true,
      message: "视频播放错误"
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
  }

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