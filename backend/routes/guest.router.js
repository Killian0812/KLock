const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { FirebaseStorage } = require('../firebase/firebase');
const bucket = FirebaseStorage.bucket();
const User = require('../models/user.model');
const Room = require('../models/room.model');

const uploadToFirebaseStorage = (file) => {
    const destination = file.filename;

    const uploadOptions = {
        destination: destination,
        public: true, // set to true if you want the file to be publicly accessible
        metadata: {
            contentType: file.mimetype,
        },
    };

    return bucket.upload(file.path, uploadOptions);
};

router.post('/testEntry', upload.single('file'), async function (req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(file);
    try {
        await uploadToFirebaseStorage(file);
        console.log('File uploaded');

        // test file downloading from firebase
        // const myFile = bucket.file(file.originalname);
        // const destinationPath = "./uploads/" + file.originalname;

        // try {
        //     await myFile.download({ destination: destinationPath });
        //     console.log('File downloaded successfully');
        // }
        // catch {
        //     console.log("File download failed");
        // }
        return res.status(200).json("OK");
    } catch (error) {
        console.error('Error uploading file to Firebase Storage:', error);
        return res.status(500).send('Internal Server Error');
    }
});

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

module.exports = router;
