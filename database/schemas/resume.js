var mongoose = require('mongoose');
var db = require('../connection')();

var ResumeSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  path:      String
});

module.exports = db.connection.model('Resume', ResumeSchema);