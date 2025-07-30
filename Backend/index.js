//require express
const express = require("express");

//require cors
const cors = require("cors");

//require connect function
const { connectMongoDB } = require("./connection");

//require authRoutes
const authRoutes = require("./routes/authRoutes");

//require habitRoutes
const habitRoutes = require("./routes/habitRoutes");

//require quotesRoutes
const quoteRoutes = require("./routes/quoteRoutes");

//require logRoutes
const logRoutes=require("./routes/logRoutes");

//require communityRoutes
const communityRoutes = require("./routes/communityRoutes");

//require shopRoutes
const shopRoutes = require("./routes/shopRoutes");

//require community controller for initialization
const { initializeChannels } = require("./controllers/communityController");

//app and port creation
const app = express();
const PORT = 8001;

// Create HTTP server
const server = require('http').createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//middlewares for body to be json or form during post request and cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//mongoDB connection
connectMongoDB("mongodb://127.0.0.1:27017/Zenity")
  .then(() => {
    console.log("MongoDB connnected");
    // Initialize default channels after DB connection
    initializeChannels();
  })
  .catch((err) => {
    console.log("Error:", err);
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a channel
  socket.on('join-channel', (channelId) => {
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });

  // Leave a channel
  socket.on('leave-channel', (channelId) => {
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel ${channelId}`);
  });

  // Handle new message
  socket.on('new-message', (data) => {
    socket.to(data.channelId).emit('message-received', data.message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

app.use("/api/auth", authRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/log", logRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/shop", shopRoutes);

//app listen
server.listen(PORT, () => console.log("Server started at port:", PORT));
