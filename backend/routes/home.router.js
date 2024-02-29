const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verifyRole = require('../middlewares/verifyRole');

router.route('/testapi')
    .get(homeController.handleGet)
    .post(verifyRole("CHAT_USER"), homeController.handlePost)
    .put(verifyRole("CHAT_ADMIN"), homeController.handlePut)
    .delete(verifyRole("CHAT_ADMIN", "CHAT_USER"), homeController.handleDelete)

module.exports = router;
