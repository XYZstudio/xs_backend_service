var mongoose = require('mongoose');
var db = require('../connection')();

var VideoSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description:  String,
  video_path:   String,
  preview:      Boolean,
  homework: [
    {
      homeworkName: { type: String }
    }
  ]
});

module.exports = db.connection.model('Videos', VideoSchema);