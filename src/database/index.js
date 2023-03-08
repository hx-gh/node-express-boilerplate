const Sequelize = require('sequelize');
const { performance } = require('perf_hooks');
const User = require('./models/User');
const executeRelationships = require('./relationships');

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const Models = [];

fs.readdir(`${__dirname}/models`, (err, filename) => {
	filename.filter((file) => {
		return (
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
		);
	});
	filename.forEach(async (file) => {
		const model = await require(path.join(`${__dirname}/models`, file));
		return Models.push(model);
	});
});

class Database {
	constructor() {
		console.log(`[SERVER] Database running on ${process.env.NODE_ENV} mode`);
		if (process.env.NODE_ENV === 'test') {
			this.connection = new Sequelize({
				dialect: 'sqlite',
				storage: './src/database/database.sqlite',
				logging: false,
			});
			this.sequelize = this.connection;
			this.Sequelize = Sequelize;
		}
		if (process.env.NODE_ENV !== 'test') {
			this.connection = new Sequelize(
				process.env.DB_CREDENTIALS_DATABASE,
				process.env.DB_CREDENTIALS_USER,
				process.env.DB_CREDENTIALS_PASSWORD,
				{
					dialect: process.env.DB_DIALECT,
					dialectOptions: {
						options: {
							requestTimeout: 45000,
						},
					},
					host: process.env.DB_CREDENTIALS_HOST,
					port: process.env.DB_PORT,
					logging: true,
				}
			);
			this.sequelize = this.connection;
			this.Sequelize = Sequelize;
		}
	}
	async init() {
		let t1 = performance.now();
		await this.connection.authenticate();
		Models.map((model) => model.init(this.connection));
		await executeRelationships();
		let t2 = performance.now();
		let t3 = (t2 - t1) / 1000;
		console.log(`[SERVER] Database tooked ${t3}s to initialize`);
	}
}

module.exports = new Database();
