var mongoose = require('mongoose');
var db = require('../connection')();

var HomeworkSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  question: String,
  answer: String
});

module.exports = db.connection.model('Homework', HomeworkSchema);