const generateHash = require('../../utils/Authentication/generateHash');
const generateRandomString = require('../../utils/Authentication/generateRandomString');

function generateTokens() {
	let token = generateRandomString(8);
	let hash = generateHash(token);
	return {
		status: true,
		message: 'Token generated successfully',
		token,
		hash: hash.data,
	};
}

module.exports = generateTokens;
