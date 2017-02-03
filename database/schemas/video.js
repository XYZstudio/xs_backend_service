var mongoose = require('mongoose');
var db = require('../connection')();

var VideoSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  video_path: String,
  homework: [{
      homework_id: {
      	type: mongoose.Schema.Types.ObjectId,
      	ref: 'Homework'
      }
  }]
});

module.exports = db.connection.model('Video', VideoSchema);