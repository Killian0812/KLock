const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// router.use(verifyJWT);
router.route('/testapi')
    .get(homeController.api)

module.exports = router;
