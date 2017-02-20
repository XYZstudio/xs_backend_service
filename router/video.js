// Module
const koa = require('koa');
const router = require('koa-router')();
var app = koa();

var fs = require("fs")
var path = require("path");

// Collection
var Homework = require('../database/schemas/homeworks');
var Videos = require('../database/schemas/videos');

// Route
router.post('/add_video', function*() {
	  console.log("add video");
    var req = this.request.body;

    var video = {
      name: req.name,
	    description: req.description,
	    video_path: req.video_path,
	    homework: req.homework
    };

    try {
      yield Videos.create(video);
    } catch(e) {
      this.status(500);
    }

    this.body = video;
});

router.post('/add_homework_to_video', function*() {
    console.log("[router.video] POST: add_homework_to_video");
    var req = this.request.body;
    var hw_name = req.hw_name;
    var video_name = req.video_name;
    try {
      var hw = yield Homework.find({"name": hw_name});
      var video = yield Videos.find({"name": video_name});
      if( hw.length == 1 && video.length == 1) {
        video[0].homework.push(hw_name);
        Videos.update({_id: video[0]._id}, video[0].toObject(), {new: true}, function(err, comment){
          if(err){
            console.log(err);
            return;
          }
        });
      } else{
        console.log("invalid homework or video");
        this.body = {
          error: true,
          response: '作业名或视频名称不正确'
        };
      }
    } catch(e) {
      console.log(e);
    }
});

router.get('/display/:video_name', function*() {
  console.log("[router.video] GET: display");
  const video_name = this.params.video_name;
  var video = yield Videos.findOne({"name": video_name});
  console.log(video.video_path);
  var file = video.video_path;
  var headers = this.headers; 
  console.log(this.headers);
  var range;
  var positions;
  var start;
  var file_size;
  var end;
  var chunksize;
  var stream_position;

  if (! fs.existsSync(path)) {
      this.body = {
        error: true,
        response: "file not exists"
      }
  }



  range = headers.range;
    
  if(!range)
  {
    let err = new Error("Wrong range");
      this.status = 416;
      this.body = {
        error: true,
        resposne: "Wrong range"
      }
    return ;
  }

  var stats = fs.statSync(file);
  positions = range.replace(/bytes=/, "").split("-");

  start = parseInt(positions[0], 10);

  file_size = stats.size;

  
  end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;


  chunksize = (end - start) + 1;


  stream_position = {
    start: start,
    end: end
  }

  this.set("Content-Range", "bytes " + start + "-" + end + "/" + file_size);
  
  this.set("Accept-Ranges", "bytes");

  this.set("Content-Length", chunksize);

  this.set("Content-Type", "video/mp4");

  this.status = 206;
  this.body = fs.createReadStream(file, stream_position);

});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}