var mongoose = require('mongoose');
var db = require('./connection')();

var usersSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String
});

module.exports = db.connection.model('USERS', usersSchema);