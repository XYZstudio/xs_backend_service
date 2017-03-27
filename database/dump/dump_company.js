const co = require('co');
const mongoose = require('mongoose');
const Companies = require('../../database/schemas/companies');
const config = require('./config.json');
const dump = require('./dump.json').company;

co(function* () {
  yield Companies.remove({});
  for (let i = 0; i < dump.length; i++) {
    let temp = dump[i];
    yield Companies.create({
      companyTitle: temp.companyTitle,
      companyImage: temp.companyImage,
      companyInfo: temp.companyInfo,
      companyLocation: temp.companyLocation,
      companyId: temp.companyId
    });
  }

  mongoose.connection.close(function () {
    console.log('Done, mongoose connection disconnected');
  });
});