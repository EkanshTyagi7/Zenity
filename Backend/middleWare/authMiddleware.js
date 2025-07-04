// middleware/authMiddleware.js
const jwt  = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function protect(req, res, next) {
  try {
    // 1) Get token
    let token = req.cookies.token;
    if (!token && req.headers.authorization?.startsWith("Bearer "))
      token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not logged in" });

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
