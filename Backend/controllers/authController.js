const User   = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

// helper to create cookie + json response
function sendToken(user, statusCode, res) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // "30d"
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    domain: "localhost",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(statusCode).json({
    status: "success",
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}

// ---------- SIGN‑UP ----------
exports.handleUserSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (await User.exists({ email }))
      return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    sendToken(user, 201, res);            // auto‑login after signup
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ---------- SIGN‑IN ----------
exports.handleUserSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    sendToken(user, 200, res);           // <-- sets the 30‑day cookie
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
