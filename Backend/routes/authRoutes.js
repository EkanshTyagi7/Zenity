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

// Add level/xp endpoint
router.get("/level", authMiddleware, (req, res) => {
    const user = req.user;
    const nextLevelXP = user.level < 10 ? user.level * 100 : 0;
    res.json({
        success: true,
        level: user.level,
        xp: user.xp,
        nextLevelXP,
        maxLevel: 10
    });
});

module.exports = router;
