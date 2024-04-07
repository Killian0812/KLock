const router = require('express').Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.handleLogin)

router.post('/mobile', loginController.handleMobileLogin);

module.exports = router;
