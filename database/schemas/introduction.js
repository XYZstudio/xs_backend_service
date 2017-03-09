var mongoose = require('mongoose');
var db = require('../connection')();

var IntroductionSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  userId:   { type: String, unique: true },
  avatarPath:       String, 
  selfIntroduction: String,
  myWebsite:        String,
  weibo:            String,
  qq:               String,
  Wechat:           String,
  tweeter:          String,
  facebook:         String, 
  linkedin:         String,
  renren:           String
});

module.exports = db.connection.model('Introductions', IntroductionSchema);