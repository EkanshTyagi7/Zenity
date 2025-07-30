const express = require('express');
const router = express.Router();
const { purchaseItem, getUserItems } = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');

// Purchase item (requires authentication)
router.post('/purchase', authMiddleware, purchaseItem);

// Get user's purchased items
router.get('/user-items/:userId', authMiddleware, getUserItems);

module.exports = router; 