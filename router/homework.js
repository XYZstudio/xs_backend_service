// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();
var Users = require('../database/schemas/users');
var Homeworks = require('../database/schemas/homeworks');

// Route

// find a home work by name
router.post('/get_homework_by_name', function*() {
  console.log("[router.homework] POST: get_homework_by_name");
  var hw_name = this.request.body.homeworkName;
  var homework;
  
  try {
    homework = yield Homeworks.find({name: hw_name});
  } catch(e) {
    this.status = 500;
    return;
  }
  this.body = homework;
  return;
});

router.get('/get_homework_by_name', function*() {
  console.log("[router.homework] GET: get_homework_by_name");
  var hw_name = this.header.homeworkName;
  var homework;
  
  try {
    homework = yield Homeworks.find({name: hw_name});
  } catch(e) {
    this.status = 500;
    return;
  }
  this.body = homework;
  return;
});

//{
//  "name": "", 
//  "title": "", 
//  "description": "", 
//  "question": "", 
//  "answer": ""
//}
router.post('/add_homework', function*() {
	console.log("[router.homework] POST: add_homework");
  var req = this.request.body;
  var hw_name = req.name;
  var hw = yield Homeworks.find({"name": hw_name});
  if( hw.length >= 1) {
    this.body = {
      error: true,
      response: "作业名: '" + hw_name + "'已存在"
    }
    return;
  }

  var homework = {
    name: req.name,
	  title: req.title,
	  description: req.description,
	  question: req.question,
	  answer: req.answer
  };
  try {
    yield Homeworks.create(homework);
  } catch(e) {
    this.status(500);
  }
});

//  return all homeworks
router.get('/homeworks', function*() {
  console.log("[router.homework] GET: homeworks");
  var homework_list = yield Homeworks.find();
   this.body = {
      response: homework_list
    }
});



// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}