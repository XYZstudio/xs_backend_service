var mongoose = require('mongoose');
var db = require('../connection')();

var PaymentHistorySchema = new mongoose.Schema({
  user_id: String,
  product_id: String,
  trade_id: String,
  fee: Number,
  date: { type : Date, default: Date.now }
});

module.exports = db.connection.model('PaymentHistory', PaymentHistorySchema);