require('dotenv').config({
	path: process.env.NODE_ENV !== 'development' ? '.env.test' : '.env.dev',
});
require('dotenv').config();
module.exports =
	process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production'
		? {
				dialect: 'sqlite',
				storage: './src/database/database.sqlite',
		  }
		: {
				username: process.env.DB_CREDENTIALS_USER,
				password: process.env.DB_CREDENTIALS_PASSWORD,
				database: process.env.DB_CREDENTIALS_DATABASE,
				host: process.env.DB_CREDENTIALS_HOST,
				dialect: 'mssql',
		  };
