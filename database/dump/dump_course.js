const fs = require('fs');
const path = require('path');
const co = require('co');
const mongoose = require('mongoose');
const Courses = require('../../database/schemas/courses');
const config = require('./config.json');
const dump = require('./dump.json').course;

var getImgPath = function(index, course_img) {
  return path.resolve(__dirname, config.store_dir, index, 'image', course_img);
};

co(function* () {
  for (let i = 0; i < dump.length; i++) {
    let course = dump[i];
    let course_img_dir = getImgPath(course.index, course.img);
    let course_img_base64 = fs.readFileSync(course_img_dir).toString('base64');
    let videos = course.video_name;
    videos = videos.map(v => {
      return { videoName: v };
    });
    yield Courses.create({
      name: course.name,
      description: course.description,
      image: course_img_base64,
      video: videos
    });
  }

  mongoose.connection.close(function () {
    console.log('Done, mongoose connection disconnected');
  });
});