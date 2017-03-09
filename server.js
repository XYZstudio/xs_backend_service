// Module
const koa = require('koa');
const mount = require('koa-mount');
const session = require('koa-session');
const cors = require('kcors');
const body_parser = require('koa-body-parser');
const isPromise = require('is-promise');

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

// Router

// No need for auth
app.use(mount('/api/v1', require('./router/register')));
app.use(mount('/api/v1', require('./router/verify')));
app.use(mount('/api/v1', require('./router/course')));
// for personal information
app.use(mount('/api/v1', require('./router/introduction')));
app.use(mount('/api/v1', require('./router/contactInfo')));
app.use(mount('/api/v1', require('./router/resume')));
app.use(mount('/api/v1', require('./router/educationBackground')));
app.use(mount('/api/v1', require('./router/workExperience')));
app.use(mount('/api/v1', require('./router/basicInfo')));

// Need for auth
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
app.use(mount('/api/v1', require('./router/homework')));
app.use(mount('/api/v1', require('./router/video')));
app.use(mount('/api/v1', require('./router/user')));


// This is runnable as a stand alone server
if (require.main === module) {
  console.log('Server started at', config.port);
  app.listen(config.port);
}
