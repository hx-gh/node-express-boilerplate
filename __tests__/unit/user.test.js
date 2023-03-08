const bcrypt = require('bcryptjs');
const database = require('../../src/database');
const factory = require('../factory');
const truncate = require('../utils/truncate');

describe('User', () => {
	beforeAll(async () => {
		await database.init();
	});
	it('Should encrypt user password', async () => {
		const user = await factory.create('User');
		const compareHash = await bcrypt.compare(user.password, user.passwordHash);
		expect(compareHash).toBe(true);
	});
});
