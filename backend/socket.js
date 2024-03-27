const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const getRecieverSocketId = (username) => {
    return userSocketMap[username];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("an user connected", socket.id);
    const username = socket.handshake.query.username;
    if (username)
        userSocketMap[username] = socket.id;
    console.log(userSocketMap);

    socket.on("disconnect", (data) => {
        console.log("an user disconnected", socket.id);
        if (socket.id === userSocketMap[username])
            delete userSocketMap[username];
        console.log(userSocketMap);
    });
});

module.exports = { app, io, server, getRecieverSocketId };