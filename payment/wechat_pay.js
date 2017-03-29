const fs = require('fs');
const path = require('path');
const config = require('../config.json').payment.wechat;
const WXPay = require('weixin-pay');
const qr = require('qr-image');

const wxpay = WXPay({
	appid: config.appid,
	mch_id: config.mch_id,
	partner_key: config.partner_key
});

wxpay.createUnifiedOrder({
	body: '扫码支付测试',
	out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://a63ff0e6.ngrok.io/api/v1/get_wechat_pay',
	trade_type: 'NATIVE',
	product_id: '1234567890'
}, function(err, res){
	console.log(res);
	const qr_code = qr.imageSync(res.code_url, { type: 'png' }).toString('base64');
	console.log(qr_code);
});

// look up an order
// wxpay.queryOrder({ transaction_id:"4005522001201703295057330902" }, function(err, order){
// 	console.log(order);
// });