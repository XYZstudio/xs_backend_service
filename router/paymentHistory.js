// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var PaymentHistory = require('../database/schemas/paymentHistory');
var Users = require('../database/schemas/users');

// Route

// update payment history by user id
router.post('/update_user_payment_history_by_id', function*() {
  console.log("[router.paymentHistory] POST: update_user_payment_history_by_id");
  var body = this.request.body;
  var user_id = body.userId;
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
    "userId":               user_id,
    "courseId":             body.courseId,
    "product_id":           body.product_id,
    "paymentType":          body.paymentType, 
    "price":                body.price
  };

  var user_payment = yield PaymentHistory.findOne({userId: user_id});
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
router.get('/get_user_payment_history_by_id/:userId', function*() {
  console.log("[router.paymentHistory] GET: get_user_payment_history_by_id");
  const user_id = this.params.userId;
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
  

  payments = yield PaymentHistory.find({userId: user_id});

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