var User = require('../models/user.model');

const handleGet = async (req, res) => {
    const Users = await User.find({});
    if (!Users)
        res.status(400).json("Error fetching user list");
    else
        res.status(200).json(Users);
}

const handlePost = (req, res) => {
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