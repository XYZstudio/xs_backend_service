var mongoose = require('mongoose');
var db = require('../connection')();

var WorkExperienceSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  order:            Number, 
  companyName:      String, 
  title:            String,
  location:         String,
  startTime:        String, 
  endTime:          String,
  description:      String
});

module.exports = db.connection.model('WorkExperience', WorkExperienceSchema);