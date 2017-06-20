const fs = require('fs');
const path = require('path');
const co = require('co');
const mongoose = require('mongoose');
const Videos = require('../../database/schemas/videos');
const config = require('./config.json');
const dump = require('./dump.json').video;

var getPath = function(index, type, file) {
  return path.resolve(__dirname, config.store_dir, index, type, file);
};

co(function* () {
  for (let i = 0; i < dump.length; i++) {
    let video = dump[i];
    let video_img_dir = getPath(video.index, 'image', video.img);
    let video_img_base64 = fs.readFileSync(video_img_dir).toString('base64');
    let video_dir = getPath(video.index, 'video', video.video);
    try {
      yield Videos.create({
        name: video.name,
        description: video.description,
        image: video_img_base64,
        video_path: video_dir,
        preview: video.preview,
        order: i,
        homework: []
      });
    } catch(e) {
      console.error(e);
    }
  }

  mongoose.connection.close(function () {
    console.log('Done, mongoose connection disconnected');
  });
});