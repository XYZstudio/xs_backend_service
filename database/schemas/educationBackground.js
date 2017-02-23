var mongoose = require('mongoose');
var db = require('../connection')();

var WorkExperienceSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  order:            Number, 
  schoolName:       String, 
  location:         String,
  startTime:        String, 
  endTime:          String,
  degree:           String,
  major:            String,
  description:      String
});

module.exports = db.connection.model('WorkExperience', WorkExperienceSchema);