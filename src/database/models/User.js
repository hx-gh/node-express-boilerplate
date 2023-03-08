const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { generateClientJWT } = require('../../services/JWT/JWTController');

class User extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.DataTypes.INTEGER,
				},
				name: Sequelize.DataTypes.STRING,
				email: Sequelize.DataTypes.STRING,
				password: Sequelize.DataTypes.VIRTUAL,
				passwordHash: Sequelize.DataTypes.STRING,
				company: Sequelize.DataTypes.STRING,
				createdAt: {
					type: Sequelize.DataTypes.DATE,
				},
				updatedAt: {
					type: Sequelize.DataTypes.DATE,
				},
			},
			{
				sequelize,
				hooks: {
					beforeSave: async (user) => {
						if (user.password) {
							return (user.passwordHash = await bcrypt.hash(user.password, 8));
						}
					},
					beforeUpdate: async (user) => {
						if (user.password) {
							return (user.passwordHash = await bcrypt.hash(user.password, 8));
						}
					},
				},
				timestamps: true,
				modelName: 'Users',
			}
		);
	}
}
User.prototype.checkPassword = function (password) {
	return bcrypt.compare(password, this.passwordHash);
};
User.prototype.generateToken = function () {
	return generateClientJWT();
};

module.exports = User;
