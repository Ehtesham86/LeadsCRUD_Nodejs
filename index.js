const express = require('express');
const cookieParser = require('cookie-parser')
const cors= require('cors');
const connectDb = require('./config/db');
require('dotenv').config()
const authRoute= require('./routes/authRoute')
const postRoute= require('./routes/postRoute')
const userRoute = require('./routes/userRoute');
const passport = require('./controllers/googleController');
const Message = require('./models/Message');
const socketIO = require('socket.io');
const http = require('http');
const chatRoutes = require('./routes/chatRoutes');



const app = express()
app.use(express.json())
app.use(cookieParser())
const server = http.createServer(app);


const corsOptions = {
    origin: "http://localhost:3000", // Ensure this matches your frontend URL
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
};
const io = socketIO(server, {
    cors: corsOptions
  });
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handles OPTIONS method

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
//     });
// app.use(cors(corsOptions))

connectDb()

app.use(passport.initialize())

//api route
app.use('/api/chat', chatRoutes);

app.use('/auth',authRoute)
app.use('/users',postRoute)
app.use('/users',userRoute)

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
  
    // Handle sendMessage
    socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();
  
      // Emit message to receiver
      io.emit('receiveMessage', newMessage); // You can use rooms for private chat
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected: ', socket.id);
    });
  });
  

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server listening on ${PORT}`))