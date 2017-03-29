// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();

// Route
// Wechat payment notification
router.post('/get_wechat_pay', function*() {
  console.log("[router.wechat_pay] POST: get_wechat_pay");
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}