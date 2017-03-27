// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var Companies = require('../database/schemas/companies');

// Route
// update basic information by id
router.get('/get_career_companies', function*() {
  console.log("[router.career] GET: get_career_companies");

  try {
    let companies = yield Companies.find({});
    this.body = companies;
  } catch(e) {
    this.status = 500;
    return;
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}