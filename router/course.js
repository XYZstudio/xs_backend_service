// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();

// Collection
var Videos = require('../database/schemas/video');
var Courses = require('../database/schemas/course');

// Route
router.post('/add_course', function*() {
	  console.log("add course");
    var req = this.request.body;
    
    var course = {
      name: req.name,
	    title: req.title,
	    description: req.description
    };
    try {
      yield Courses.create(course);
    } catch(e) {
      this.status(500);
  }
});

router.post('/add_video_to_course', function*() {
    console.log("add video to course");
    var req = this.request.body;
    var video_name = req.video_name;
    var course_name = req.course_name;
    try {
      var course = yield Courses.find({"name": course_name});
      var video = yield Videos.find({"name": video_name});
      if( video.length == 1 && video.length == 1) {
        course[0].video.push(video[0]._id);
        Courses.update({_id: course[0]._id}, course[0].toObject(), {new: true}, function(err, comment){
          if(err){
            console.log(err);
            return;
          }
        });
      } else{
        console.log("invalid course or video");
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