var User = require('../models/user.model');
var Room = require('../models/room.model');
var Entry = require('../models/entry.model');

async function handleGetRooms(req, res) {
    console.log("Admin fetching rooms");
    const rooms = await Room.find({});
    return res.status(200).json(rooms);
}

async function handleNewRoom(req, res) {
    const user = await User.findOne({ username: "Killian0812" });
    const newRoom = new Room({ name: "Test", mac: "123abc", manager: [user._id] });
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

async function handleDeleteRoom(req, res) {
    const roomId = req.params.id;

    try {
        // delete the room 
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        // delete references to the room from users
        await User.updateMany({ room: roomId }, { $pull: { room: roomId } });
        // const users = await User.find({ room: roomId });
        // console.log(users);

        // delete entries
        await Entry.deleteMany({ mac: deletedRoom.mac });

        console.log('Room deleted');
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting room:', error);
        return res.sendStatus(500);
    }
}

module.exports = { handleNewRoom, handleGetRooms, handleDeleteRoom };