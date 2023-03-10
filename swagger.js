const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		version: '1.0.0',
		title: 'Express + Jest + Swagger Template',
		description:
			'Documentation automatically generated by the <b>swagger-autogen</b> module.',
	},
	host: 'localhost:3000',
	basePath: '/',
	schemes: ['https'],
	consumes: ['application/json'],
	produces: ['application/json'],
	tags: [
		{
			name: 'User',
			description: 'Endpoints',
		},
		{
			name: 'Main',
			description: 'Endpoints',
		},
		{
			name: 'Dashboard',
			description: 'Endpoints',
		},
	],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.js'];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
	require('./src/server.js'); // Your project's root file
});
swaggerAutogen(outputFile, endpointsFiles);
