var Room = require('../models/room.model');
var User = require('../models/user.model');

const handleGet = (req, res) => {
    console.log("Someone requesting /GET");
    res.status(200).json("OK");
}

const handlePost = async (req, res) => {
    console.log("Here");
    const myUser = await User.findOne({ username: "Killian0812" });
    const newRoom = new Room({});
    newRoom.save()
        .then(() => console.log("Inserted"))
        .catch(err => console.log(err));
    console.log("Someone requesting /POST");
    res.status(200).json("OK");
}

const handleDelete = (req, res) => {
    console.log("Someone requesting /DELETE");
    res.status(200).json("OK");
}

const handlePut = (req, res) => {
    console.log("Someone requesting /PUT");
    res.status(200).json("OK");
}
module.exports = { handleGet, handleDelete, handlePost, handlePut };