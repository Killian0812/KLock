const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
// const server = http.createServer(app);

app.use(cors());

// middlewares
app.use(express.json());
app.use(cookieParser());

// mongodb atlas connect
const uri = process.env.MONGODB_KILLIANCLUSTER_URI;
mongoose.connect(uri, { dbName: 'klock' });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connection established successfully");
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

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh', refreshTokenRouter);
app.use('/logout', logoutRouter);

// only exec authorization before accessing /home
app.use('/home', verifyJWT, homeRouter);

app.use('/admin', verifyJWT, adminRouter);

// server host
const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server is running at " + port);
})