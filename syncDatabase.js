//Used for Sync FK and PK's to the database
//Use with caution
process.env.NODE_ENV === 'development'
	? require('dotenv').config({ path: './.env.dev' })
	: require('dotenv').config({ path: './.env.test' });
const database = require('./src/database');
const executeRelationships = require('./src/database/relationships');

module.exports.syncDatabase = async function () {
	try {
		await database.init();
		await executeRelationships();
		await sequelize.sync({ alter: true });
		return console.log(
			'[SERVER] Database syncronization executed successfully'
		);
	} catch (error) {
		console.log(error);
		return console.log(
			'[SERVER] Error while performing database syncronization'
		);
	}
};
