const faker = require('faker');
const co = require('co');
const mongoose = require('mongoose');
const Courses = require('../../database/schemas/courses');
const Videos = require('../../database/schemas/videos');
const VIDEO_PATH = '../videos/sample.mp4';
const PREVIEW_PATH = '../videos/preview_sample.mp4';

co(function* () {
  for (var i = 0; i < 21; i++) {
    var courseName = `${faker.commerce.productName()} ${i}`;
    var videos = [];
    
    for (var j = 0; j < 10; j++) {
      var preview = false;
      if (j === 1) { preview = true; }
      var video = {
        name: `${faker.commerce.productName()}_${i}${j}`,
        description: faker.lorem.sentences(),
        video_path: preview ? PREVIEW_PATH : VIDEO_PATH,
        preview: preview,
      };
      videos.push({ videoName: video.name });
      yield Videos.create(video);
    }

    yield Courses.create({
      name: courseName,
      description: faker.lorem.sentence(),
      image: faker.random.image(),
      video: videos
    });
  }

  mongoose.connection.close(function () {
    console.log('Done, mongoose connection disconnected');
  });
});