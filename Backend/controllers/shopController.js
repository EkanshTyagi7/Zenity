const User = require('../models/User');

async function addXPAndHandleLevelUp(userId, xpToAdd) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let xp = user.xp + xpToAdd;
    let level = user.level;
    let leveledUp = false;

    while (level < 10 && xp >= level * 100) {
      xp -= level * 100;
      level += 1;
      leveledUp = true;
    }

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

exports.purchaseItem = async (req, res) => {
  try {
    const { userId, itemType, itemId, itemName, itemPrice } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let hasEnoughCurrency = false;
    let currencyType = '';
    
    if (itemType === 'pets') {
      if (user.stars >= itemPrice) {
        user.stars -= itemPrice;
        hasEnoughCurrency = true;
        currencyType = 'stars';
      }
    } else {
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

    const levelUpResult = await addXPAndHandleLevelUp(userId, 8);

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

exports.getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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