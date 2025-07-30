const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const authenticate = require("../middleware/auth"); // The middleware we just created
// Protected routes
router.get("/", authenticate, shopController.getUserShopData);
router.post("/purchase", authenticate, shopController.purchaseItem);
router.post("/equip", authenticate, shopController.equipItem);

module.exports = router;