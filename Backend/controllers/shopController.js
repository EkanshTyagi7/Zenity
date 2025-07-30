const User = require('../models/User');

// Helper function to add XP and handle level up
async function addXPAndHandleLevelUp(userId, xpToAdd) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let xp = user.xp + xpToAdd;
    let level = user.level;
    let leveledUp = false;

    // Check for level up (max level 10)
    while (level < 10 && xp >= level * 100) {
      xp -= level * 100;
      level += 1;
      leveledUp = true;
    }

    // Cap at level 10, XP doesn't increase further
    if (level >= 10) {
      level = 10;
      xp = 0;
    }

    user.xp = xp;
    user.level = level;
    await user.save();
    
    return { leveledUp, newLevel: level, newXP: xp };
  } catch (err) {
    console.error("Error updating XP/level:", err);
  }
}

// Purchase item and award XP
exports.purchaseItem = async (req, res) => {
  try {
    const { userId, itemType, itemId, itemName, itemPrice } = req.body;

    // Get user and check if they have enough currency
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check currency based on item type
    let hasEnoughCurrency = false;
    let currencyType = '';
    
    if (itemType === 'pets') {
      // Pets cost stars
      if (user.stars >= itemPrice) {
        user.stars -= itemPrice;
        hasEnoughCurrency = true;
        currencyType = 'stars';
      }
    } else {
      // Avatars and themes cost coins
      if (user.coins >= itemPrice) {
        user.coins -= itemPrice;
        hasEnoughCurrency = true;
        currencyType = 'coins';
      }
    }

    if (!hasEnoughCurrency) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${currencyType || 'currency'}`,
        required: itemPrice,
        available: itemType === 'pets' ? user.stars : user.coins
      });
    }

    // Award XP for the purchase (8 XP for any purchase)
    const levelUpResult = await addXPAndHandleLevelUp(userId, 8);

    // Save user with updated currency
    await user.save();

    res.status(200).json({
      success: true,
      message: "Purchase successful",
      itemType,
      itemId,
      itemName,
      itemPrice,
      xpAwarded: 8,
      leveledUp: levelUpResult?.leveledUp || false,
      newLevel: levelUpResult?.newLevel,
      newXP: levelUpResult?.newXP,
      remainingCoins: user.coins,
      remainingStars: user.stars
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to process purchase",
      error: err.message 
    });
  }
};

// Get user's purchased items (for inventory)
exports.getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // This would typically return items from a separate collection
    // For now, return empty array
    res.status(200).json({
      success: true,
      items: []
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user items",
      error: err.message 
    });
  }
}; 