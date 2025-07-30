const express = require("express");
const router = express.Router();
const {
  getChannels,
  getChannelMessages,
  sendMessage,
} = require("../controllers/communityController");

//require auth middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Get all channels (public)
router.get("/channels", getChannels);

// Get messages for a specific channel (public)
router.get("/channels/:channelId/messages", getChannelMessages);

// Send a message to a channel (requires authentication)
router.post("/channels/:channelId/messages", authMiddleware, sendMessage);

module.exports = router; 