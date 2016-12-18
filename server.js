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
  allowMethods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(body_parser());

// Router
app.use(mount('/api/v1', require('./router/auth')));

// This is runnable as a stand alone server
if (require.main === module) {
  if(config.port === 80) {
    // If this is production
    
  } else {
    // If this is development
    
  }
  console.log('Server started!');
  app.listen(config.port);
}
