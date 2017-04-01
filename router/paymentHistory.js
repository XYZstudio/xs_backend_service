// Module
const koa = require('koa');
const router = require('koa-router')();
const app = koa();
const PaymentHistory = require('../database/schemas/paymentHistory');
const Users = require('../database/schemas/users');

// Route

// update payment history by user id
router.post('/update_user_payment_history_by_id', function*() {
  console.log("[router.paymentHistory] POST: update_user_payment_history_by_id");
  var body = this.request.body;
  var user_id = body.user_id;
  var user;
  
  try {
    user = yield Users.findOne({_id: user_id});
    if( user == null || user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
  } catch(e) {
    this.status = 500;
    return;
  }

  var payment = {
    "user_id": user_id,
    "product_id": body.product_id,
    "trade_id": body.trade_id,
    "fee": body.fee
  };

  var user_payment = yield PaymentHistory.findOne({user_id: user_id});
  if( user_payment == null || body._id == null ) {
    try {
      console.log("creating payment");
      payment = yield PaymentHistory.create(payment);
    } catch(e) {
      console.log(e);
      this.status = 500;
      return;
    }  
  } else {
    try {
      console.log("updating payment");
      payment = yield PaymentHistory.update({_id: body._id}, payment, {new: true});
      payment.update = true;
    } catch(e) {
      console.log(e);
      this.status = 500;
      return;
    }  
  }
  

  this.body = payment;
  return;
});

// get payment history by user id
router.get('/get_user_payment_history_by_id/:user_id', function*() {
  console.log("[router.paymentHistory] GET: get_user_payment_history_by_id");
  const user_id = this.params.user_id;
  var contact;

  try {
    var user = yield Users.find({_id: user_id});
    if( user.length < 1 ) {
      this.body = {
        error: true, 
        response: "用户不存在"
      }
      return;
    }
  } catch(e) {
    this.status = 500;
    return;
  }
  

  payments = yield PaymentHistory.find({user_id: user_id});

  if ( payments == null ) {
    this.body = {};
    return;
  }

  this.body = payments;
  return;
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}