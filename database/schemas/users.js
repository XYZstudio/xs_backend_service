const mongoose = require('mongoose');
const db = require('../connection')();
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name:          String,
  password:      String,
  status:        String,
  verify:        String,
  lastActivity: {
    courseName:  String,
    videoName:   String,
    time:        Number
  },
  course: [
    {
      courseName: { type: String },
      finished: [
        {
          videoName: { type: String }
        }
      ]
    }
  ]
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};


module.exports = db.connection.model('Users', UserSchema);