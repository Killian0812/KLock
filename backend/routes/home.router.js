const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verifyRole = require('../middlewares/verifyRole');
const User = require('../models/user.model');

router.route('/testapi')
    .get(homeController.handleGet)
    .post(verifyRole("USER"), homeController.handlePost)
    .put(verifyRole("USER", "ADMIN"), homeController.handlePut)
    .delete(verifyRole("ADMIN"), homeController.handleDelete)

router.route('/getUserInfo/:username').get(async (req, res) => {
    console.log("Someone getting info");
    var user = await User.findOne({ username: req.params.username });
    user.password = null;
    return res.status(200).json(user);
})

router.route('/updateExpoPushToken/:username').post(async (req, res) => {
    console.log("Someone updating info");
    var user = await User.findOne({ username: req.params.username });
    user.expoPushToken = req.body.expoPushToken;
    console.log(req.body);
    await user.save();
    return res.status(200).json("OK");
})

module.exports = router;
