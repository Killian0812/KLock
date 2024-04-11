var User = require('../models/user.model');
var Room = require('../models/room.model');

async function handleNewRoom(req, res) {
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
}
module.exports = { handleNewRoom };