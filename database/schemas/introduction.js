var mongoose = require('mongoose');
var db = require('../connection')();

var IntroductionSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  avatarPath:       String, 
  selfIntroduction: String,
  gender:           String,
  birthYear:        Number,
  birthMonth:       Number,
  birthDate:        Number,
  highestDegree:    String,
  business:         String,
  myWebsite:        String,
  weibo:            String,
  qq:               String,
  Wechat:           String,
  tweeter:          String,
  facebook:         String, 
  linkedin:         String,
  renren:           String,
  hobbies:          [String]
});

module.exports = db.connection.model('Introductions', IntroductionSchema);