
const User_Routes = require('./routes/user_routes');

const router = require('express').Router();
//Definição de Rotas
router.use('/user_api', User_Routes);

module.exports = router;
