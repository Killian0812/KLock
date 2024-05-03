var User = require('../models/user.model');
var Room = require('../models/room.model');
var Entry = require('../models/entry.model');

async function handleGetRooms(req, res) {
    console.log("Admin fetching rooms");
    const rooms = await Room.find({});
    return res.status(200).json(rooms);
}

async function handleNewRoom(req, res) {
    const { name, mac, managers } = req.body;

    try {
        // Check duplication
        let existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ exist: 0 });
        } else {
            existingRoom = await Room.findOne({ mac });
            if (existingRoom) {
                return res.status(400).json({ exist: 1 });
            }
        }

        const newRoom = new Room({ name, mac, managers: [] });

        // Update new room's managers and related users
        for (const manager of managers) {
            newRoom.managers.push(manager._id);
            let user = await User.findById(manager._id);
            if (user) {
                user.room.push(newRoom._id);
                await user.save();
            }
        }

        // Save new room
        await newRoom.save();

        console.log("New room added");
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function handleEditRoom(req, res) {
    const roomId = req.params.id;
    const { name, mac, managers } = req.body;

    try {
        const room = await Room.findById(roomId);

        // Check duplication
        if (room.name !== name) {
            let existingRoom = await Room.findOne({ name });
            if (existingRoom) {
                return res.status(400).json({ exist: 0 });
            }
        } else if (room.mac !== mac) {
            let existingRoom = await Room.findOne({ mac });
            if (existingRoom) {
                return res.status(400).json({ exist: 1 });
            }
        }

        // Update managers and related users
        const newManagers = [];
        for (const manager of managers) {
            newManagers.push(manager._id);
            let user = await User.findById(manager._id);
            if (user && !user.room.includes(roomId)) {
                user.room.push(roomId);
                await user.save();
            }
        }

        // Remove roomId from old managers
        const oldManagersIds = room.managers.map(manager => manager.toString());
        const managersToRemove = oldManagersIds.filter(managerId => !managers.includes(managerId));
        for (const managerIdToRemove of managersToRemove) {
            let user = await User.findById(managerIdToRemove);
            if (user) {
                user.room = user.room.filter(id => id.toString() !== roomId);
                await user.save();
            }
        }

        // Update room with new managers
        room.managers = newManagers;
        await room.save();

        console.log("Room edited");
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

async function handleGetRoom(req, res) {
    const roomId = req.params.id;

    try {
        const room = await Room.findById(roomId);
        return res.status(200).json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
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

module.exports = { handleNewRoom, handleGetRooms, handleDeleteRoom, handleGetAllUsers, handleGetRoom, handleEditRoom };