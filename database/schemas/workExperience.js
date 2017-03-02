var mongoose = require('mongoose');
var db = require('../connection')();

var WorkExperienceSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  companyName:      String, 
  title:            String,
  location:         String,
  startYear:        Number, 
  startMonth:       Number, 
  endYear:          Number,
  endMonth:         Number,
  description:      String
});

module.exports = db.connection.model('WorkExperience', WorkExperienceSchema);