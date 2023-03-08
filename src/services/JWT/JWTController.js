const JWT = require('jsonwebtoken');
const Crypto = require('crypto-js');
const cron = require('node-cron');
class JWTController {
	constructor() {
		this.JWTEncryptionKey = '';
		this.scheduleCronTask();
	}
	async scheduleCronTask() {
		console.log('[SERVER] Scheduling Cron Tasks');
		this.generateJWTEncryptionKey();
		process.env.NODE_ENV === 'development'
			? cron.schedule('00 12 */1 * *', () => {
					return generateJWTEncryptionKey();
			  })
			: null;
	}
	async generateJWTEncryptionKey() {
		let string = Crypto.SHA256(
			new Date().toISOString().split('T')[0] + 'Word-AddIn-Report'
		).toString();
		return (this.JWTEncryptionKey = string);
	}
	async validateClientJWTMiddleware(req, res, next) {
		/*
		 * Returns an response based on the authorization status.
		 * THIS MIDDLEWARE IS NOT BEING USED BY THIS MOMENT
		*/
		let header = req.headers.authorization;
		if (header === undefined) {
			return res
				.status(401)
				.json({ status: false, message: 'Invalid session' });
		}
		let token = header.split(' ');
		try {
			let key = this.JWTEncryptionKey;
			let decrypted = Crypto.AES.decrypt(token[1], key);
			const str = decrypted.toString(Crypto.enc.Utf8);
			if (str.length > 0) {
				let response = JWT.verify(str, 'Word-AddIn-Report');
				return next();
			} else {
				return res
					.status(401)
					.json({ status: false, message: 'Invalid session' });
			}
		} catch (error) {
			console.log(error);
			return res
				.status(401)
				.json({ status: false, message: 'Expirated session' });
		}
	}
}
JWTController.prototype.generateClientJWT = async (IP) => {
	let token = JWT.sign(
		{
			IP,
			thisIsASecretToken: 'this is a secret token, should not be exposed',
		},
		'Word-AddIn-Report',
		{ expiresIn: '7d' }
	);
	let encryptedToken = Crypto.AES.encrypt(
		`${token}`,
		`${this.JWTEncryptionKey}`
	).toString();
	return encryptedToken;
};
JWTController.prototype.validateClientJWT = async (req) => {
	let header = req.headers.authorization;
	if (header === undefined) {
		return { status: false, message: 'Headers are not present' };
	}
	let token = header.split(' ');
	try {
		let key = this.JWTEncryptionKey;
		let decrypted = Crypto.AES.decrypt(token[1], key);
		const str = decrypted.toString(Crypto.enc.Utf8);
		if (str.length > 0) {
			return { status: true, message: 'Success' };
		} else {
			return { status: false, message: 'Invalid session' };
		}
	} catch (error) {
		return { status: false, message: 'Expirated session' };
	}
};

module.exports = new JWTController();
