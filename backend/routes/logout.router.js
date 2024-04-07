const router = require('express').Router();
const logoutController = require('../controllers/logout.controller');

router.get('/', logoutController.handleLogout)

router.post('/mobile', logoutController.handleMobileLogout)

module.exports = router;
