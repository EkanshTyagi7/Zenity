require("dotenv").config(); 

//require express
const express = require("express");

//require cors
const cors = require("cors");

const cookieParser = require("cookie-parser");

//require connect function
const { connectMongoDB } = require("./connection");

//require authRoutes
const authRoutes = require("./routes/authRoutes");

//require protect middleware
const protect = require("./middleWare/authMiddleware");

//app and port creation
const app = express();
const PORT = process.env.PORT || 8001;

// ✅ Use CORS middleware just once with all allowed origins
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true,
}));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 

//mongoDB connection
connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connnected"))
  .catch((err) => {
    console.log("Error:", err);
  });

//auth routes
app.use("/api/auth", authRoutes);

//protected route
app.get("/api/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

//listen
app.listen(PORT, () => console.log("Server started at port:", PORT));
