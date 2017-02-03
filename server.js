// Module
const koa = require('koa');
const mount = require('koa-mount');
const session = require('koa-session');
const cors = require('kcors');
const body_parser = require('koa-body-parser');

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

// Need for auth
app.use(mount('/api/v1', require('./router/auth')));

//for homework
app.use(mount('/api/v1', require('./router/homework')));

//for video
app.use(mount('/api/v1', require('./router/video')));

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

// This is runnable as a stand alone server
if (require.main === module) {
  console.log('Server started!');
  app.listen(config.port);
}
