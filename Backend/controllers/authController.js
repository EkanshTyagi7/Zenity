//require model
const User = require("../models/User");

//require bcrypt
const bcrypt = require("bcryptjs");

//Controller function for SignUp
async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

//Controller function for SignIn
async function handleUserSignIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Success (for now, just return a message)
    return res.status(200).json({ message: `Welcome back, ${user.name}!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
};
