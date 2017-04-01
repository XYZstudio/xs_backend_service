// Module
const koa = require('koa');
const router = require('koa-router')();
const config = require('../config.json');
const wechat_lib = require('./wechat_lib');
const ip_lib = require('../service/ip_address');
const Courses = require('../database/schemas/courses');
const PaymentHistory = require('../database/schemas/paymentHistory');
var app = koa();

// Route
// Wechat unified order
router.post('/wechat/order', function*() {
  console.log("[router.wechat_router] POST: /wechat/pay");
  let body = this.request.body;
  try {
  	let total_fee = yield Courses.findOne({ name: body.product_id });
	  total_fee = total_fee.fee;
	  const user_id = body.email;
	  const product_id = body.product_id;
	  const spbill_create_ip = config.host;
	  const out_trade_no = `${new Date().getTime()}${Math.random().toString().substr(2, 7)}`;
		const order = yield wechat_lib.order(out_trade_no, total_fee, spbill_create_ip, product_id);
		yield PaymentHistory.create({
			user_id: user_id,
		  product_id: product_id,
		  trade_id: out_trade_no,
		  fee: total_fee,
		});
		this.body = order.qr_code;
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