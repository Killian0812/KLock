var User = require('../models/user.model');
var Room = require('../models/room.model');
var Entry = require('../models/entry.model');

async function handleGetRooms(req, res) {
    console.log("Admin fetching rooms");
    const rooms = await Room.find({});
    return res.status(200).json(rooms);
}

async function handleNewRoom(req, res) {
    const name = req.body.name;
    const mac = req.body.mac;
    const managers = req.body.managers;

    let existingRoom = await Room.findOne({ name: name });
    if (existingRoom)
        return res.status(400).json({ exist: 0 });
    else {
        existingRoom = await Room.findOne({ mac: mac });
        if (existingRoom)
            return res.status(400).json({ exist: 1 });
    }

    const newRoom = new Room({ name: name, mac: mac, managers: [] });

    try {
        managers.forEach(async (manager) => {
            newRoom.managers.push(manager._id);
            // console.log(newRoom.managers);
            let user = await User.findById(manager._id);
            user.room.push(newRoom._id);
            await user.save();
        });
        await newRoom.save();
        console.log("New room added");
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
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

// async function handleFindUsers(req, res) {
//     const keyword = req.query.keyword;
//     const users = await User.find({ "fullname": { $regex: normalizeVietnamesePattern(keyword), $options: 'i' } });
//     return res.status(200).json(users);
// }

async function handleGetAllUsers(req, res) {
    User.find({}).then(users => {
        return res.status(200).json(users);
    }).catch((e) => {
        console.log("Error getting all users: ", e);
        return res.sendStatus(500);
    })
}

// function normalizeVietnamesePattern(keyword) {
//     const normalizedKeyword = keyword.replace(/[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/g, function (match) {
//         return `[${match}${match.toUpperCase()}]`;
//     });
//     return normalizedKeyword;
// }

module.exports = { handleNewRoom, handleGetRooms, handleDeleteRoom, handleGetAllUsers };