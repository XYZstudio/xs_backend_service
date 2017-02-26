const co = require('co');
const mongoose = require('mongoose');
const Videos = require('../../database/schemas/videos');

co(function* () {
  yield Videos.update(
    { video_path: 'VIDEO_PATH' },
    { $set: { video_path: '../videos/sample.mp4' } },
    { multi: true }
  );

  mongoose.connection.close(function () {
    console.log('Done, mongoose connection disconnected');
  });
});