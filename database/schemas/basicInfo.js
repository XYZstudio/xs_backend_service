var mongoose = require('mongoose');
var db = require('../connection')();

var BasicInfoSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  userId:   { type: String, unique: true },
  firstName:        String,
  lastName:         String, 
  currentStatus:    String,
  gender:           String,
  birthYear:        Number,
  birthMonth:       Number,
  birthDate:        Number,
  highestDegree:    String,
  careerDomain:     [String],
  hobbies:          [String]
});

module.exports = db.connection.model('BasicInfo', BasicInfoSchema);