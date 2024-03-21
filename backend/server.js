const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

// routing
const registerRouter = require('./routes/register.router');
const loginRouter = require('./routes/login.router');
const homeRouter = require('./routes/home.router');
const logoutRouter = require('./routes/logout.router');
const refreshTokenRouter = require('./routes/refreshToken.router');
const adminRouter = require('./routes/admin.router');
const guestRouter = require('./routes/guest.router');

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh', refreshTokenRouter);
app.use('/logout', logoutRouter);

// only exec authorization before accessing /home or /admin
app.use('/home', verifyJWT, homeRouter);
app.use('/admin', verifyJWT, adminRouter);

app.use('/guest', guestRouter);

// init firebase, firestore
const Firestore = require('./firebase/firebase');

// server host
const port = process.env.PORT;
const ip = process.env.IP;

app.listen(port, ip, () => {
    console.log("Server is running at " + port);
})

