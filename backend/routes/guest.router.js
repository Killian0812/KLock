const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { v4: uuidv4 } = require('uuid');
const { FirebaseStorage } = require('../firebase/firebase');
const bucket = FirebaseStorage.bucket();
const User = require('../models/user.model');
const PendingRequest = require('../models/pendingRequest.model');
const Room = require('../models/room.model');
const Entry = require('../models/entry.model');
const { sendNotifications } = require('../expo/notification.sender');
const { io, getRecieverSocketId } = require('../socket');

const uploadToFirebaseStorage = async (file) => {
    var uuid = uuidv4();
    const remoteFile = bucket.file(uuid);
    await remoteFile.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
    }).then(() => {
        console.log("File uploaded to Firebase successful");
    }).catch((err) => {
        console.log("Error uploading to Firebase: " + err);
        uuid = null;
    })
    return uuid;
}

async function handleNotification(MAC, isGuest) {
    const room = await Room.findOne({ mac: MAC });
    if (room) {
        const managers = room.managers;
        User.find({ _id: managers })
            .then(users => {
                sendNotifications(users, room, isGuest);
            })
    }
    console.log("Pushed notifications to all managers");
};

router.post('/newEntry', upload.single('File'), async function (req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).send('NO FILE UPLOADED');
    }

    // upload to firebase
    const filename = await uploadToFirebaseStorage(file);
    console.log(filename);

    // push notification to mobile app
    await handleNotification(req.body.MAC, false);

    // save to database
    const newEntry = new Entry({ mac: req.body.MAC, image: filename, name: req.body.name });
    newEntry.save().then(() => {
        return res.status(200).json("OK");
    }).catch((err) => {
        console.log(err);
        return res.status(500).json("FAILED");
    })
});

router.post('/requestApproval', upload.single('File'), async function (req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).send('NO FILE UPLOADED');
    }

    // upload to firebase
    const filename = await uploadToFirebaseStorage(file);
    console.log(filename);

    // push notification to mobile app
    await handleNotification(req.body.MAC, true);

    const MAC = req.body.MAC;
    const room = await Room.findOne({ mac: MAC });
    if (!room) {
        return res.sendStatus(500);
    }

    // save pending request to database
    const newPendingReq = new PendingRequest({ room: room._id, image: filename });
    newPendingReq.save().then(() => {
        console.log("Pending request added to database");
    }).catch((err) => {
        console.log("Error adding pending request to database: ", err);
        return res.sendStatus(500);
    });

    // realtime notification using web socket
    const managers = room.managers;
    User.find({ _id: { $in: managers } }).then((users) => {
        users.forEach(user => {
            const socketId = getRecieverSocketId(user.username);
            if (socketId) {
                const sendToUser = io.to(socketId).emit("Need Approval", {
                    pendingRequest: newPendingReq.toJSON(),
                    room: room.toJSON(),
                    file: file,
                });
                if (sendToUser)
                    console.log(`Request sent to client socket: ${user.username}`);
                else
                    console.log(`Error sending request to client socket: ${user.username}`)
            }
        });
    }).catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
    return res.sendStatus(200);
});

router.get('/pendingRequests', async function (req, res) {
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

router.post('/newRoom', async function (req, res) {
    const user = await User.findOne({ username: "Killian0812" });
    const newRoom = new Room({ mac: "123abc", manager: [user._id] });
    newRoom.save().then(async (data) => {
        user.room = [...user.room, data._id];
        await user.save();
        console.log("New room added");
        return res.status(200).json("Success");
    }).catch(err => {
        console.log(err);
        return res.status(500);
    })
});

router.get('/rooms', async function (req, res) {
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
    console.log(entries);
    return res.status(200).json(entries);
})

module.exports = router;
