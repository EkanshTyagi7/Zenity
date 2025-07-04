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

//app and port creation
const app = express();
const PORT = 8001;

//middlewares for body to be json or form during post request and cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(cookieParser()); 

//mongoDB connection
connectMongoDB("mongodb://127.0.0.1:27017/Zenity")
  .then(() => console.log("MongoDB connnected"))
  .catch((err) => {
    console.log("Error:", err);
  });

app.use("/api/auth", authRoutes);

//app listen
app.listen(PORT, () => console.log("Server started at port:", PORT));
