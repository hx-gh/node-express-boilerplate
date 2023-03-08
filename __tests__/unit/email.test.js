const factory = require('../factory');
const request = require('supertest');
const database = require('../../src/database');

describe('Email API', () => {
	beforeAll(async () => {
		await database.init();
	});
	it('Should send body to email', async () => {
		const user = await factory.create('User');
		const response = await request('https://prod-74.westus.logic.azure.com:443')
			.post(
				'/workflows/684b4f730a4c473289e6bbb33a97971c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FJkq6aRmalnfd3mLvqltNQ3cRSaas-yEZzDRCGp9BNc'
			)
			.send({
				username: 'Gustavo Oliveira',
				name: 'Gustavo Oliveira',
				email: user.email,
				password: user.password,
				tag: 'new',
			});
		expect(response.status).toBe(202);
	});
});
