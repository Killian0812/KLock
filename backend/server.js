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
mongoose.connect(uri, { dbName: 'real-time-chat' });
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

// const Message = require('./models/Message');

// run socket.io within HTTP server instance
// const io = socketIO(server);
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Listen for incoming chat messages
//     socket.on('chat message', (data) => {
//         console.log('Received message:', data);
//         const user = data.user;
//         const text = data.message;

//         // Save the message to MongoDB
//         const message = new Message({ user, text });
//         message.save()
//             .then(() => console.log("Message saved to DB"))
//             .catch(err => console.log(err));

//         // Broadcast the message to all connected clients
//         io.emit('chat message', data);
//     });

//     // Listen for user disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// server host
const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server is running at " + port);
})