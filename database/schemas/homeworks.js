var mongoose = require('mongoose');
var db = require('../connection')();

var HomeworkSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description:  String,
  question:     String,
  answer:       String
});

module.exports = db.connection.model('Homeworks', HomeworkSchema);