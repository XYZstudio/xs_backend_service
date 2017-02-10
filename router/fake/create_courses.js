const faker = require('faker');
const co = require('co');
const Courses = require('../../database/schemas/courses');

co(function* () {
  for (var i = 0; i < 21; i++) {
    yield Courses.create({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      image: faker.image.sports(),
    });
  }
});