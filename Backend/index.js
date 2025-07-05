require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./connection");

const authRoutes = require("./routes/authRoutes");
const protect = require("./middleWare/authMiddleware"); // <= match folder name

const app = express();
const PORT = process.env.PORT || 8001;

// 🔐  Allow your actual front‑end origin *once*
app.use(
  cors({
    origin: "http://localhost:5500",  // ← or 127.0.0.1:5500, not both
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

app.use("/api/auth", authRoutes);

app.get("/api/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
