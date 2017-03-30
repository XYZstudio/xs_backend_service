// Module
const koa = require('koa');
const router = require('koa-router')();
const wechat_lib = require('./wechat_lib');
const Courses = require('../database/schemas/courses');
var app = koa();

// Route
// Wechat unified order
router.post('/wechat/order', function*() {
  console.log("[router.wechat_router] POST: /wechat/pay");
  let body = this.request.body;
  try {
  	let total_fee = yield Courses.findOne({ name: body.product_id });
	  total_fee = total_fee.fee;
	  const product_id = body.product_id;
	  const spbill_create_ip = body.spbill_create_ip;
		const qrCode = yield wechat_lib.order(total_fee, spbill_create_ip, product_id);
		this.body = qrCode;
		return;
  } catch(e) {
  	console.error(e);
  	this.body = {
  		error: true,
  		message: '购买失败'
  	};
  	return;
  }
});

// Wechat check paid order
router.post('/wechat/check', function*() {
	console.log("[router.wechat_router] POST: /wechat/check");
	let body = this.request.body;
	try {
		const order = yield wechat_lib.check(body.transaction_id);
		this.body = order;
		return;
	} catch(e) {
		console.error(e);
		this.body = {
			error: true,
			message: '订单查询失败'
		};
		return;
	}
});

// Wechat notify url response
router.post('/received_wechat_pay', function*() {
  console.log("[router.wechat_router] POST: /received_wechat_pay");
  this.status = 200;
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}