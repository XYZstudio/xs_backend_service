// Module
const koa = require('koa');
const mount = require('koa-mount');
const body_parser = require('koa-body-parser');

// Config
const config = require('./config');

// App
const app = koa();

// Middleware
app.use(body_parser());

// Router
app.use(mount('/api/v1', require('./router/sample_router')));

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
