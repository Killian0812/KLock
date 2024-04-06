const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const getRecieverSocketId = (username) => {
    return userSocketMap[username];
}

const getMobileRecieverSocketId = (username) => {
    return mobileUserSocketMap[username];
}

const getDeviceSocketId = (MAC) => {
    return deviceSocketMap[MAC];
}

const userSocketMap = {};
const mobileUserSocketMap = {};
const deviceSocketMap = {};

io.on("connection", (socket) => {
    const username = socket.handshake.query.username;
    const MAC = socket.handshake.query.MAC;
    const mobileUser = socket.handshake.query.mobileUser;

    if (username) {
        console.log("An user connected", socket.id);
        userSocketMap[username] = socket.id;
        console.log(userSocketMap);

        socket.on("disconnect", () => {
            console.log("An user disconnected", socket.id);
            if (socket.id === userSocketMap[username])
                delete userSocketMap[username];
            console.log(userSocketMap);
        });
    } else if (MAC) {
        console.log("An device connected", socket.id);
        deviceSocketMap[MAC] = socket.id;
        console.log(deviceSocketMap);

        socket.on("disconnect", () => {
            console.log("An device disconnected", socket.id);
            if (socket.id === deviceSocketMap[MAC])
                delete deviceSocketMap[MAC];
            console.log(deviceSocketMap);
        });
    } else if (mobileUser) {
        console.log("An mobile user connected", socket.id);
        mobileUserSocketMap[mobileUser] = socket.id;
        console.log(mobileUserSocketMap);

        socket.on("disconnect", () => {
            console.log("An mobile user disconnected", socket.id);
            if (socket.id === mobileUserSocketMap[mobileUser])
                delete mobileUserSocketMap[mobileUser];
            console.log(mobileUserSocketMap);
        });
    }
});

module.exports = { app, io, server, getRecieverSocketId, getDeviceSocketId, getMobileRecieverSocketId };