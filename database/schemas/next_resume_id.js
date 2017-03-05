var mongoose = require('mongoose');
var db = require('../connection')();

var NextResumeIdSchema = new mongoose.Schema({
  resume_id: { type: Number, unique: true }
});

module.exports = db.connection.model('next_resume_id', NextResumeIdSchema);