var mongoose = require('mongoose');
var db = require('../connection')();

var ContactInfoSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  firstName:        String, 
  lastName:         String,
  email:            String,
  address:          String, 
  city:             String,
  province:         String,
  zipcode:          String,
  cellPhone:        String,
  mobile:           String
});

module.exports = db.connection.model('ContactInfo', ContactInfoSchema);