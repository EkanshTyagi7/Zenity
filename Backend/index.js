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

//middlewares for body to be json or form during post request and cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

app.use(cookieParser()); 

//mongoDB connection
connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connnected"))
  .catch((err) => {
    console.log("Error:", err);
  });

app.use("/api/auth", authRoutes);

//protected route
app.get("/api/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

//app listen
app.listen(PORT, () => console.log("Server started at port:", PORT));
