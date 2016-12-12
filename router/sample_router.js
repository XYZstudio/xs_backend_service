// Module
var koa = require('koa');
var router = require('koa-router')();
var app = koa();

// Config
const config = require('../config');

// Route
// Get Router
router.get('/sample', function*() {
  this.body = 'this is a get router';
});
// Post Router
router.post('/sample', function*() {
  this.body = 'this is a post router';
});
// Put Router
router.put('/sample', function*() {
  this.body = 'this is a put router';
});
// Patch Router
router.patch('/sample', function*() {
  this.body = 'this is a patch router';
});
// Delete Router
router.delete('/sample', function*() {
  this.body = 'this is a delete router';
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}