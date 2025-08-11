const express = require("express");
const router = express.Router();
const {
  getChannels,
  getChannelMessages,
  sendMessage,
} = require("../controllers/communityController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/channels", getChannels);

router.get("/channels/:channelId/messages", getChannelMessages);

router.post("/channels/:channelId/messages", authMiddleware, sendMessage);

module.exports = router; 