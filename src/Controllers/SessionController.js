const database = require('../database');
const User = require('../database/models/User');
const generateTokens = require('../services/Authentication/generateTokens');
class SessionController {
	async store(req, res) {
		// #swagger.tags = ['User']
		// #swagger.description = 'Endpoint para criar um usuário.'
		// #swagger.parameters['name'] = { description: 'Nome do usuário', type: 'string'}
		// #swagger.parameters['email'] = { description: 'E-mail do usuário', type: 'string' }
		// #swagger.parameters['password'] = { description: 'Senha do usuário', type: 'string' }
		// #swagger.parameters['roleId'] = { description: 'Nivel de permissão - 1 ao 3', type: 'string' }
		let { name, email, password, roleId } = req.body;
		const user = await User.findOne({ where: { email } });
		if (user) {
			return res
				.status(401)
				.json({ error: true, message: 'User already exists' });
		}
		try {
			const transaction = database.sequelize.transaction(
				async (transaction) => {
					let createdUser = await User.create(
						{
							name,
							email,
							password,
							roleId,
						},
						{ transaction: transaction }
					);
				}
			);
			return res.status(200).json({
				status: true,
				message: 'User created successfuly',
				transaction,
			});
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: false, message: `Internal server error: ${error}` });
		}
	}
	async authenticate(req, res) {
		// #swagger.tags = ['User']
		// #swagger.description = 'Endpoint para autenticar um usuário.'
		// #swagger.parameters['email'] = { description: 'E-mail do usuário', type: 'string' }
		// #swagger.parameters['password'] = { description: 'Senha do usuário', type: 'string' }
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: true, message: 'User not found' });
		}
		if (!(await user.checkPassword(password))) {
			return res
				.status(401)
				.json({ error: true, message: 'Password or email is incorrect;' });
		}
		return res.json({ user, token: user.generateToken() });
	}
	async retrievePassword(req, res) {
		// #swagger.tags = ['User']
		// #swagger.description = 'Endpoint para recuperar uma senha'
		// #swagger.parameters['email'] = { description: 'Email do usuário', type: 'string' }
		const { email } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: true, message: 'User not found' });
		}
		try {
			let tokens = await generateTokens();
			let transactionResult = await database.sequelize.transaction(
				async (transaction) => {
					const hasUpdated = await User.update(
						{
							password: tokens.hash,
						},
						{ where: { email } },
						{ transaction: transaction }
					);
					return hasUpdated;
				}
			);
			return res.status(200).json({
				status: true,
				message: 'New password was sent to user e-mail',
			});
		} catch (error) {
			return res
				.status(500)
				.json({ status: false, message: 'Error processing your request' });
		}
	}
	async updatePassword(req, res) {
		// #swagger.tags = ['User']
		// #swagger.description = 'Endpoint para atualizar uma senha'
		// #swagger.parameters['email'] = { description: 'E-mail do usuário', type: 'string'}
		// #swagger.parameters['password'] = { description: 'Senha antiga', type: 'string'}
		// #swagger.parameters['newPassword'] = { description: 'Senha nova', type: 'string' }
		const { email, password, newPassword } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: true, message: 'User not found' });
		}
		if (!(await user.checkPassword(password))) {
			return res
				.status(401)
				.json({ error: true, message: 'Password or email is incorrect;' });
		}
		try {
			let transactionResult = await database.sequelize.transaction(
				async (transaction) => {
					const hasUpdated = await User.update(
						{
							password: newPassword,
						},
						{
							where: { email },
							transaction: transaction,
							individualHooks: true,
						}
					);
					return hasUpdated;
				}
			);
			return res
				.status(200)
				.json({ status: true, message: 'Password updated successfully' });
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: false, message: 'Error processing your request' });
		}
	}
}
module.exports = new SessionController();
