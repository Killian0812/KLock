const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verifyRole = require('../middlewares/verifyRole');


router.route('/testapi')
    .get(homeController.handleGet)
    .post(verifyRole("USER"), homeController.handlePost)
    .put(verifyRole("ADMIN"), homeController.handlePut)
    .delete(verifyRole("ADMIN", "USER"), homeController.handleDelete)

module.exports = router;
