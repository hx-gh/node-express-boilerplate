const { factory } = require('factory-girl');
const User = require('../src/database/models/User');
const faker = require('faker');

factory.define('User', User, {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	company: faker.company.companyName(),
	roleId: 1,
});

module.exports = factory;
