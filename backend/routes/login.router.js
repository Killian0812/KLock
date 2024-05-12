const router = require('express').Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.handleLogin)

router.post('/mobile', loginController.handleMobileLogin);

router.post('/forget', loginController.handleForget);

router.post('/verify-token', loginController.handleVerifyToken);

router.post('/reset-password', loginController.handleResetPassword);

module.exports = router;
