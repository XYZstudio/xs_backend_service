var mongoose = require('mongoose');
var db = require('../connection')();

var EducationBackgroundSchema = new mongoose.Schema({
  userName: { type: String },
  schoolName:       String, 
  location:         String,
  startYear:        Number, 
  startMonth:       Number, 
  endYear:          Number,
  endMonth:         Number,
  degree:           String,
  major:            String,
  description:      String
});

module.exports = db.connection.model('EducationBackground', EducationBackgroundSchema);