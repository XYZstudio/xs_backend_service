const faker = require('faker');
const co = require('co');
const Users = require('../../database/schemas/users');

co(function* () {
  yield Users.update({}, {
    lastActivity: {
      courseName: faker.commerce.productName(),
      videoName: faker.commerce.productName(),
      time: faker.random.number()
    }
  });
});