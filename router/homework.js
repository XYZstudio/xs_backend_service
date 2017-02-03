// Module
const koa = require('koa');
const router = require('koa-router')();
//var passport = require('koa-passport');
//const LocalStrategy = require('passport-local').Strategy;
var app = koa();

// Config
//const config = require('../config');

// Collection
var Users = require('../database/schemas/users');
var Homework = require('../database/schemas/homework');

// Route
router.post('/add_homework', function*() {
	console.log("add homework");
    var req = this.request.body;
    console.log(req.title);
    
    var hw = {
      name: req.name,
	  title: req.title,
	  description: req.description,
	  question: req.question,
	  answer: req.answer
    };
    try {
    yield Homework.create(hw);
    } catch(e) {
    this.status(500);
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}