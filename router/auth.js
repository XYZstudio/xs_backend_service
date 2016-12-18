// Module
var koa = require('koa');
var router = require('koa-router')();
var app = koa();

// Config
const config = require('../config');

// Route
router.post('/login', function*() {
  this.body = this.request.body;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}