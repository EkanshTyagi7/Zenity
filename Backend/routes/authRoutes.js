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

// Get user's coins and stars
router.get("/currency", authMiddleware, (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        coins: user.coins,
        stars: user.stars
    });
});

// Update user's coins and stars
router.put("/currency", authMiddleware, async (req, res) => {
    try {
        const { coins, stars } = req.body;
        const user = req.user;
        
        if (coins !== undefined) {
            user.coins = Math.max(0, coins); // Ensure coins don't go negative
        }
        if (stars !== undefined) {
            user.stars = Math.max(0, stars); // Ensure stars don't go negative
        }
        
        await user.save();
        
        res.json({
            success: true,
            coins: user.coins,
            stars: user.stars,
            message: "Currency updated successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update currency",
            error: err.message
        });
    }
});

module.exports = router;
