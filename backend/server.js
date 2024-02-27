const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');

require('dotenv').config();

const app = express();
// const server = http.createServer(app);

app.use(cors());
app.use(express.json());


// mongodb atlas connect
const uri = process.env.MONGODB_KILLIANCLUSTER_URI;
mongoose.connect(uri, { dbName: 'real-time-chat' });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connection established successfully");
})

// routing
const registerRouter = require('./router/registerRouter');
const loginRouter = require('./router/loginRouter');
app.use('/login', loginRouter);
app.use('/register', registerRouter);

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