// Module
const koa = require('koa');
const mount = require('koa-mount');
const session = require('koa-session');
const cors = require('kcors');
const body_parser = require('koa-body-parser');
const isPromise = require('is-promise');
const fs = require('fs');

// Config
const config = require('./config');

// App
const app = koa();

// Middleware
app.keys = ['xs_cookie::secretkey'];
app.use(session({ key: 'xs:sess' }, app));
app.use(cors({
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH'],
  credentials: true
}));
app.use(body_parser());

// Directory
var resume_dir = __dirname + "/resumes";
var video_dir = __dirname + "/videos";
if (!fs.existsSync(resume_dir)){
    fs.mkdirSync(resume_dir);
}
if (!fs.existsSync(video_dir)){
    fs.mkdirSync(video_dir);
}

// Router

// No need for auth
app.use(mount('/api/v1', require('./router/register')));
app.use(mount('/api/v1', require('./router/verify')));
app.use(mount('/api/v1', require('./router/course')));
app.use(mount('/api/v1', require('./router/auth')));

app.use(function*(next) {
  if(this.isAuthenticated()) {
    this.user = this.passport.user;
    if(isPromise(this.passport.user)) {
      this.user = yield this.passport.user;
    }
    yield next;
  } else {
    this.status = 401;
  }
});

// Need for auth
app.use(mount('/api/v1', require('./router/paymentHistory')));
app.use(mount('/api/v1', require('./router/introduction')));
app.use(mount('/api/v1', require('./router/contactInfo')));
app.use(mount('/api/v1', require('./router/resume')));
app.use(mount('/api/v1', require('./router/educationBackground')));
app.use(mount('/api/v1', require('./router/workExperience')));
app.use(mount('/api/v1', require('./router/basicInfo')));
app.use(mount('/api/v1', require('./router/homework')));
app.use(mount('/api/v1', require('./router/video')));
app.use(mount('/api/v1', require('./router/user')));


// This is runnable as a stand alone server
if (require.main === module) {
  console.log('Server started at', config.port);
  app.listen(config.port);
}
