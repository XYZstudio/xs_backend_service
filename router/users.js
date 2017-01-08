// Module
var koa = require('koa');
var router = require('koa-router')();
var app = koa();

// Config
const config = require('../config');

// Database
var Users = require('../database/users');

// Route
router.post('/create_user', function*() {
  var user = this.request.body;
  yield Users.create(user);
  this.body = user;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}