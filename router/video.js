// Module
const koa = require('koa');
const router = require('koa-router')();
//var passport = require('koa-passport');
//const LocalStrategy = require('passport-local').Strategy;
var app = koa();

// Config
//const config = require('../config');

// Collection
var Homework = require('../database/schemas/homework');
var Videos = require('../database/schemas/video');

// Route
router.post('/add_video', function*() {
	  console.log("add video");
    var req = this.request.body;
    
    var video = {
      name: req.name,
	    title: req.title,
	    description: req.description,
	    video_path: req.video_path,
	    homework: req.homework
    };
    try {
      yield Videos.create(video);
    } catch(e) {
      this.status(500);
  }
});

router.post('/add_homework_to_video', function*() {
    console.log("add homework to video");
    var req = this.request.body;
    var hw_name = req.hw_name;
    var video_name = req.video_name;
    try {
      var hw = yield Homework.find({"name": hw_name});
      var video = yield Videos.find({"name": video_name});
      if( hw.length == 1) {
        video[0].homework.push(hw[0]._id);
        Videos.update({_id: video[0]._id}, video[0].toObject(), {new: true}, function(err, comment){
          if(err){
            console.log(err);
            return;
          }
        });
      } else{
        console.log("invalid homework or video");
      }
      //console.log(hw[0].title);
    } catch(e) {
      console.log(e);
  }
});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}