const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factory');
const jwt = require('jsonwebtoken');
const database = require('../../src/database');

describe('Session methods', () => {
	beforeAll(async () => {
		await database.init();
	});
	beforeEach(async () => {
		//await truncate();
	});
	it('Should not authenticate without a valid user', async () => {
		const response = await request(app).post('/v1/user_api/authenticate').send({
			email: 'mail@test.com',
			password: '123456',
		});
		expect(response.status).toBe(401);
	});
	it('Should not authenticate with invalid password', async () => {
		const user = await factory.create('User');
		const response = await request(app).post('/v1/user_api/authenticate').send({
			email: user.email,
			password: '123456',
		});
		expect(response.status).toBe(401);
	});
	it('Should return jwt token when authenticated', async () => {
		const user = await factory.create('User');
		const response = await request(app).post('/v1/user_api/authenticate').send({
			email: user.email,
			password: user.password,
		});
		expect(response.body).toHaveProperty('token');
	});
	/*it('Should be able to access private routes when authenticated', async () => {
		const user = await factory.create('User');
		const response = await request(app)
			.get('/dashboard/main')
			.set('Authorization', `Bearer ${user.generateToken()}`);
		expect(response.status).toBe(200);
	});*/
	/*it('Should not be able to access private routes without JWT token', async () => {
		const response = await request(app).get('/dashboard/main');
		expect(response.status).toBe(401);
	});*/
	/*it('Should not be able to access private routes with invalid JWT Token', async () => {
		const user = await factory.create('User');
		const response = await request(app)
			.get('/dashboard/main')
			.set(
				'Authorization',
				`Bearer ` + jwt.sign({ id: user.id }, 'WRONG_SECRET')
			);
		expect(response.status).toBe(401);
	});*/
});
