var mongoose = require('mongoose');
var db = require('../connection')();

var PaymentHistorySchema = new mongoose.Schema({
  userId:               String,
  courseId:             String,
  product_id:           String,
  paymentDate: { type : Date, default: Date.now },
  paymentType:          String, 
  price:                Number
});

module.exports = db.connection.model('PaymentHistory', PaymentHistorySchema);