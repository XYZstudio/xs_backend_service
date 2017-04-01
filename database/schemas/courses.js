var mongoose = require('mongoose');
var db = require('../connection')();

var CourseSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description:  String,
  image:        String,
  fee: 					Number,
  video: [
    {
      videoName: { type: String }
    }
  ]
});

module.exports = db.connection.model('Courses', CourseSchema);