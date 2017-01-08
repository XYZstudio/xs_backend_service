var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var url = 'mongodb://localhost:27017/sporit';
var options = {
  server: { reconnectTries: Number.MAX_VALUE }
};
var db_temp = null;

var get_connection = function(resolve, reject) {
  var db = mongoose.createConnection(url, options);

  // if connection failed
  db.on('error', function(err) {
    console.error('Error: MongoDb error', error_count, url, err.message, db.readyState);
    reject(err.message);
  });

  // if connection succeeded
  db.once('open', function() {
    console.info('Success: Connected to MongoDb(mongoose) ', url);
    resolve(db);
  });

  return db;
};

module.exports = function() {
  var connection;
  var db = db_temp;

  if (!db) {
    db = {
      connection: null,
      connected: null,
      mongoose: null
    };

    var promise = new Promise(function(resolve, reject) {
      connection = get_connection(resolve, reject);
    });

    promise.then(function(connection) {
      db.connection = connection;
    });

    db = {
      connection: connection,
      connected: promise,
      mongoose: mongoose
    };
    db_temp = db;
  }

  return db;
};