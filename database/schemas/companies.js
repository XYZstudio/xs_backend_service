var mongoose = require('mongoose');
var db = require('../connection')();

var CompanySchema = new mongoose.Schema({
  companyId: { type: String, unique: true },
  companyTitle: { type: String, unique: true },
  companyImage: String,
  companyInfo: String,
  companyLocation: String,
  companyId: String
});

module.exports = db.connection.model('Companies', CompanySchema);