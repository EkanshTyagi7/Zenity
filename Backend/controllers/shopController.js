const User = require("../models/User");

module.exports = {
  // Get user's shop data
  async getUserShopData(req, res) {
    const user = await User.findById(req.user.userId);
    res.json({
      coins: user.coins,
      stars: user.stars,
      unlockedItems: user.unlockedItems,
      equippedItems: user.equippedItems
    });
  },

  // Handle purchases
  async purchaseItem(req, res) {
    try {
      console.log('Purchase request body:', req.body);
      const { itemId, itemType, cost } = req.body;
      const user = await User.findById(req.user.userId);

      // Deduct currency
      user[itemType === 'pet' ? 'stars' : 'coins'] -= cost;
      user.unlockedItems.push({ itemId, itemType });
      await user.save();

      res.json({ coins: user.coins, stars: user.stars });
    } catch (error) {
      console.error('Purchase error:', error);
      res.status(500).json({ error: error.message || 'Failed to save purchase' });
    }
  },

  // Equip item (add this function)
  async equipItem(req, res) {
    const { itemType, itemId } = req.body;
    const user = await User.findById(req.user.userId);

    // Check if user owns the item
    const ownsItem = user.unlockedItems.some(
      (item) => item.itemId === itemId && item.itemType === itemType
    );
    if (!ownsItem) {
      console.error('Equip error: item not unlocked', { itemType, itemId, unlockedItems: user.unlockedItems });
      return res.status(400).json({ error: "Item not unlocked", itemType, itemId, unlockedItems: user.unlockedItems });
    }

    user.equippedItems[itemType] = itemId;
    await user.save();

    res.json({ equippedItems: user.equippedItems });
  }
};