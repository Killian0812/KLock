const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyRole = require('../middlewares/verifyRole');

router.route('/users')
    .get(verifyRole("CHAT_ADMIN"), adminController.handleGet)

router.route('/users/:id')
    .post(verifyRole("CHAT_ADMIN"), adminController.handlePost)
    .put(verifyRole("CHAT_ADMIN"), adminController.handlePut)
    .delete(verifyRole("CHAT_ADMIN"), adminController.handleDelete)

module.exports = router;
