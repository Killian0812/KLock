var Room = require('../models/room.model');
var User = require('../models/user.model');
const { Firestore, FirebaseStorage } = require('../firebase/firebase');

const handleGet = (req, res) => {
    console.log("Someone requesting /GET");
    res.status(200).json("OK");
}

const handlePost = async (req, res) => {
    try {
        console.log(req.file);
        return res.status(200).json("OK");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleDelete = (req, res) => {
    console.log("Someone requesting /DELETE");
    res.status(200).json("OK");
}

const handlePut = (req, res) => {
    console.log("Someone requesting /PUT");
    res.status(200).json("OK");
}
module.exports = { handleGet, handleDelete, handlePost, handlePut };