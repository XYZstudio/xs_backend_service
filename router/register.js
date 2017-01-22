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
  var req = this.request.body;
  var user = {
    email: req.email,
    name: req.name,
    password: req.password,
    status: 'active'
  };
  
  try {
    yield Users.create(user);
  } catch(e) {
    this.status(500);
  }

  this.body = user;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}