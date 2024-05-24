const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const { app, server } = require('./socket');

app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// mongodb atlas connect
const uri = process.env.MONGODB_KILLIANCLUSTER_URI;
mongoose.connect(uri, { dbName: 'klock' });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB Cloud connection established successfully");
})

// custom middlewares
const verifyJWT = require('./middlewares/verifyJWT');
const verifyActive = require('./middlewares/verifyActive');

// routing
const registerRouter = require('./routes/register.router');
const loginRouter = require('./routes/login.router');
const homeRouter = require('./routes/home.router');
const logoutRouter = require('./routes/logout.router');
const refreshTokenRouter = require('./routes/refreshToken.router');
const adminRouter = require('./routes/admin.router');
const guestRouter = require('./routes/guest.router');

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/refresh', refreshTokenRouter);
app.use('/api/logout', logoutRouter);

// only exec authorization before accessing /home or /admin
app.use('/api/home', verifyJWT, verifyActive, homeRouter);
app.use('/api/admin', verifyJWT, adminRouter);

app.use('/api/guest', guestRouter);

const buildPath = path.resolve(__dirname, '../build');
app.use(express.static(buildPath));

app.get(/^\/(?!api).*/, function (req, res) {
    res.sendFile(
        path.join(buildPath, 'index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

// server host
const port = process.env.PORT;
const ip = process.env.IP;

server.listen(port, ip, () => {
    console.log(`Server running at ${ip}:${port}`);
});

