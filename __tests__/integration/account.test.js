const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factory');
const database = require('../../src/database');

describe('Account methods', () => {
	beforeAll(async () => {
		await database.init();
	});
	it('Should create new account', async () => {
		const response = await request(app).post('/v1/user_api/create').send({
			name: 'Gustavo Oliveira',
			email: 'gustavo.oliveira@silkendevelopment.com.br',
			password: '123456',
			roleId: 1,
		});
		expect(response.status).toBe(200);
	});
	/*it('Should not create duplicated accounts', async () => {
		let first_response = await request(app).post('/v1/user_api/create').send({
			name: 'Gustavo Oliveira',
			email: 'gustavo.oliveira@silkendevelopment.com.br',
			password: '123456',
			roleId: 1
		});
		let response = await request(app).post('/v1/user_api/create').send({
			name: 'Gustavo Oliveira',
			email: 'gustavo.oliveira@silkendevelopment.com.br',
			password: '123456',
			roleId: 1
		});
		expect(response.status).toBe(401);
	});*/
	it('Should update account password', async () => {
		const user = await factory.create('User');
		const response = await request(app).post('/v1/user_api/update').send({
			email: user.email,
			password: user.password,
			newPassword: 'asd123456',
		});
		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Password updated successfully');
	});
	it('Should not updated account that doesnt exists', async () => {
		const response = await request(app).post('/v1/user_api/update').send({
			email: 'mail@test.com',
			password: '123456',
			newPassword: 'asd123456',
		});
		expect(response.status).toBe(401);
		expect(response.body.message).toBe('User not found');
	});
	it('Should not updated account with wrong password', async () => {
		const user = await factory.create('User');
		const response = await request(app).post('/v1/user_api/update').send({
			email: user.email,
			password: '123456',
			newPassword: 'asd123456',
		});
		expect(response.status).toBe(401);
		expect(response.body.message).toBe('Password or email is incorrect;');
	});
	it('Should receive a new account password', async () => {
		const user = await factory.create('User');
		const response = await request(app)
			.post('/v1/user_api/retrieve_password')
			.send({
				email: user.email,
			});
		expect(response.status).toBe(200);
		expect(response.body.message).toBe('New password was sent to user e-mail');
	});
	it('Should not send a password to a user that doesnt exists', async () => {
		const response = await request(app)
			.post('/v1/user_api/retrieve_password')
			.send({
				email: 'mail@test.com',
			});
		expect(response.status).toBe(401);
		expect(response.body.message).toBe('User not found');
	});
});
