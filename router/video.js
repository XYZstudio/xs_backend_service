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

router.post('/display/:video_name', function*() {
  console.log("[router.video] GET: display");
  var video = yield Videos.find({"name": video_name});
  var file = video.video_path;

  fs.stat(file, function(err, stats) {

    if(err)
    {

      console.log(err)
      if(err.code === 'ENOENT')
      {
        this.status = 404;
        return;
      }
      this.body = err;
      return;
    }

    let range = req.headers.range;
    //let range = req.body.range;
    console.log(req.headers);
    
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

    let positions = range.replace(/bytes=/, "").split("-");

    let start = parseInt(positions[0], 10);

    let file_size = stats.size;

    console.log("positions[1] ===============>" + positions[1]);
    console.log("file_size ===============>" + file_size);
    let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
    console.log("end ===============>" + end);

    let chunksize = (end - start) + 1;

    this.set("Content-Range", "bytes " + start + "-" + end + "/" + file_size);
    this.set("Accept-Ranges", "bytes");
    this.set("Content-Length", chunksize);
    this.set("Content-Type", "video/mp4");

    let stream_position = {
      start: start,
      end: end
    }


    let stream = fs.createReadStream(file, stream_position)


    stream.on("open", function() {

      stream.pipe(this.body);

    })

    stream.on("error", function(err) {

      return next(err);

    });

  });

});

// Export
app.use(router.routes());
module.exports = app;

// If this router is a stand alone server
if (require.main === module) {
  app.listen(config.port);
}