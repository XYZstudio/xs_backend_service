var mongoose = require('mongoose');
var db = require('../connection')();

var CourseSchema = new mongoose.Schema({
  name: String,
  description: String, 
  video: [{
      video_id: {
      	type: mongoose.Schema.Types.ObjectId,
      	ref: 'Video'
      }
  }]
});

module.exports = db.connection.model('Course', CourseSchema);