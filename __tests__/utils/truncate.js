const User = require('../../src/database/models/User');

const Models = [User];

module.exports = () => {
	try {
		return Promise.all(
			Models.map((key) => {
				return key.destroy({ truncate: true, force: true });
			})
		);
	} catch (error) {
		return console.log(error);
	}
};
