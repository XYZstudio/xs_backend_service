const faker = require('faker');
const co = require('co');
const Intro = require('../../database/schemas/introduction');

co(function* () {
  for(var i = 0; i < 10; i ++) {
  	var introduction = {
  		userName:         `${faker.commerce.productName()} ${i}`,
        avatarPath:       faker.system.filePath(), 
        myWebsite:        faker.internet.url(),
        tweeter:          faker.internet.url(),
        facobook:         faker.internet.url(), 
        linkedin:         faker.internet.url(),
        renren:           faker.internet.url()
  	};
  	yield Intro.create(introduction);
  }

});