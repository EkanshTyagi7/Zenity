const express = require("express");

//require controllers
const {
  handleUserSignUp,
  handleUserSignIn,
} = require("../controllers/authController");

//require auth middleware
const authMiddleware = require("../middlewares/authMiddleware");

//require router
const router = express.Router();

router.post("/signup", handleUserSignUp);
router.post("/signin", handleUserSignIn);

// Verify token endpoint
router.get("/verify", authMiddleware, (req, res) => {
    res.json({ 
        success: true, 
        user: req.user 
    });
});

module.exports = router;
