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

const order = function(out_trade_no, total_fee, spbill_create_ip, product_id) {
	return new Promise(function(resolve, reject) {
		wxpay.createUnifiedOrder({
			body: '思博锐-课程购买',
	  	out_trade_no: out_trade_no,
	  	total_fee: total_fee,
	  	spbill_create_ip: spbill_create_ip,
	  	notify_url: 'http://www.sporit.cn/api/v1/received_wechat_pay',
	  	trade_type: 'NATIVE',
	  	product_id: product_id
		}, function(err, res){
			if (err) {
				reject();
			} else {
				const qr_code = qr.imageSync(res.code_url, { type: 'png' }).toString('base64');
				resolve(Object.assign(res, { qr_code: qr_code }));
			}
		});
	});
};

// transaction_id: 32 length
const check = function(transaction_id) {
	return new Promise(function(resolve, reject) {
		wxpay.queryOrder({ transaction_id: transaction_id }, function(err, order){
			if (err) {
				reject();
			} else {
				resolve(order);
			}
		});
	});
}

const gen_qr = function(url) {
	return qr.imageSync(url, { type: 'png' }).toString('base64');
};

// Promisify
module.exports = {
	order: order,
	check: check,
	gen_qr: gen_qr,
};
