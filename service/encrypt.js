// Module
const bcrypt = require('bcrypt');
const co = require('co');
const SALT_WORK_FACTOR = 10;

module.exports = co.wrap(function*(target, noDot) {
  var token = null;
  try {
    var salt = yield bcrypt.genSalt(SALT_WORK_FACTOR);
    token = yield bcrypt.hash(target, salt);
    if (noDot) {
      token = token.replace(/[\/\.]/g, '_');
    }
  } catch(e) {
    console.error(e);
  }
  
  return token;
});