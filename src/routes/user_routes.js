const SessionController = require('../Controllers/SessionController');

const router = require('express').Router();

router.post('/create', SessionController.store);
router.post('/authenticate', SessionController.authenticate);
router.post('/update', SessionController.updatePassword);
router.post('/retrieve_password', SessionController.retrievePassword);

module.exports = router;
