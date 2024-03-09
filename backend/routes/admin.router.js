const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyRole = require('../middlewares/verifyRole');

router.route('/users')
    .get(verifyRole("ADMIN"), adminController.handleGet)

router.route('/users/:id')
    .post(verifyRole("ADMIN"), adminController.handlePost)
    .put(verifyRole("ADMIN"), adminController.handlePut)
    .delete(verifyRole("ADMIN"), adminController.handleDelete)

module.exports = router;
