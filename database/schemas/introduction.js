var mongoose = require('mongoose');
var db = require('../connection')();

var IntroductionSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  avatarPath:       String, 
  myWebsite:        String,
  tweeter:          String,
  facobook:         String, 
  linkedin:         String,
  renren:           String
});

module.exports = db.connection.model('Introductions', IntroductionSchema);