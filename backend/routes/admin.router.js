const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyRole = require('../middlewares/verifyRole');

router.route('newRoom')
    .post(verifyRole("ADMIN"), adminController.handleNewRoom);

module.exports = router;
