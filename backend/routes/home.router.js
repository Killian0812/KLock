const router = require('express').Router();
const homeController = require('../controllers/home.controller');
const verifyRole = require('../middlewares/verifyRole');
const User = require('../models/user.model');
const Room = require('../models/room.model');
const Entry = require('../models/entry.model');
const PendingRequest = require('../models/pendingRequest.model');
const { io, getDeviceSocketId } = require('../socket');

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

router.get('/rooms', verifyRole("USER"), async function (req, res) {
    console.log("Quering rooms");
    const user = await User.findOne({ username: req.query.username });
    const query = { _id: { $in: user?.room } };
    const rooms = await Room.find(query);
    // console.log(rooms);
    return res.status(200).json(rooms);
})

router.get('/roomDetails', async function (req, res) {
    console.log("Quering room detail with id:" + req.query.id);
    const room = await Room.findOne({ _id: req.query.id });
    console.log(room);
    return res.status(200).json(room);
})

router.get('/roomEntries', async function (req, res) {
    console.log("Quering room entries with mac address: " + req.query.mac);
    const entries = await Entry.find({ mac: req.query.mac });
    // console.log(entries);
    return res.status(200).json(entries);
})

router.get('/pendingRequests', verifyRole("USER"), async function (req, res) {
    console.log("Quering pending request");
    const user = await User.findOne({ username: req.query.username });
    const roomIds = user.room;
    // replace ref with actual room object 
    PendingRequest.find({ room: { $in: roomIds } }).populate('room').then((pendingRequests) => {
        // console.log(pendingRequests);
        return res.status(200).json(pendingRequests);
    }).catch(() => {
        return res.sendStatus(500);
    })
})

router.route('/approveEntry').post(verifyRole("USER"), async (req, res) => {
    const MAC = req.body.MAC;
    const status = req.body.status;

    console.log("approving for room: ", MAC);

    console.log(`${status}: ${MAC}`);   

    // delete request in db
    PendingRequest.findByIdAndDelete(req.body.id)
        .then(() => console.log("Pending request successfully removed"))
        .catch((e) => console.log("Error removing pending request: ", e));

    // emit to AD socket here
    const socketId = getDeviceSocketId(MAC);
    if (socketId) {
        const sendToDevice = io.to(socketId).emit(status);
        if (sendToDevice)
            console.log(`Approval sent to device: ${MAC}`);
        else
            console.log(`Error sending approval to device: ${MAC}`)
        return res.sendStatus(200);
    }
    else {
        return res.sendStatus(200);
    }
});

module.exports = router;
