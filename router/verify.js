// Module
const koa = require('koa');
const router = require('koa-router')();
const app = koa();
const config = require('../config');
const Users = require('../database/schemas/users');

// Route
router.get('/verify/:token', function*() {
  const token = this.params.token;
  try {
    yield Users.update({ verify: token }, { status: 'active' });
  } catch(e) {
    console.error(e);
    this.status = 500;
  }

  this.status = 200;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}