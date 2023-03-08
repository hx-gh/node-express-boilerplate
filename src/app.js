process.env.NODE_ENV === 'development'
	? require('dotenv').config({ path: './.env.dev' })
	: require('dotenv').config({ path: './.env.test' });
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');
const Database = require('./database');
class AppController {
	constructor() {
		this.express = express();
		this.middlewares();
		this.routes();
		this.database();
	}
	async database() {
		await Database.init();
	}
	middlewares() {
		this.express.use(express.json());
		this.express.use(helmet());
		this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
		console.log('[SERVER] Helmet dressed on');
		this.express.use(cors());
		console.log('[SERVER] Cors enabled');
	}
	routes() {
		this.express.use('/v1', require('./routes'));
	}
}
module.exports = new AppController().express;
