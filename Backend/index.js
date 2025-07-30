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

// require shopRoutes
const shopRoutes = require("./routes/shopRoutes");

//app and port creation
const app = express();
const PORT = 8001;

//middlewares for body to be json or form during post request and cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//mongoDB connection
connectMongoDB("mongodb://127.0.0.1:27017/Zenity")
  .then(() => console.log("MongoDB connnected"))
  .catch((err) => {
    console.log("Error:", err);
  });


app.use("/api/auth", authRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/log", logRoutes);
app.use("/api/shop", shopRoutes);

//app listen
app.listen(PORT, () => console.log("Server started at port:", PORT));
