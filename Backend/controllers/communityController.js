const Community = require("../models/Community");
const User = require("../models/User");

const getChannels = async (req, res) => {
  try {
    const channels = await Community.find().populate("messages.user", "name");
    
    const groupedChannels = channels.reduce((acc, channel) => {
      if (!acc[channel.category]) {
        acc[channel.category] = [];
      }
      acc[channel.category].push(channel);
      return acc;
    }, {});

    res.json({ success: true, channels: groupedChannels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Community.findById(channelId).populate("messages.user", "name");
    
    if (!channel) {
      return res.status(404).json({ success: false, message: "Channel not found" });
    }

    res.json({ success: true, messages: channel.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    const channel = await Community.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: "Channel not found" });
    }

    const newMessage = {
      user: userId,
      content,
      timestamp: new Date(),
    };

    channel.messages.push(newMessage);
    await channel.save();

    const populatedChannel = await Community.findById(channelId).populate("messages.user", "name");
    const savedMessage = populatedChannel.messages[populatedChannel.messages.length - 1];

    res.json({ success: true, message: savedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const initializeChannels = async () => {
  try {
    const existingChannels = await Community.find();
    if (existingChannels.length > 0) {
      await Community.deleteMany({});
      console.log("Cleared existing channels and messages");
    }

    const defaultChannels = [
      // Mental Health Support
      { name: "daily-check-ins", category: "Mental Health Support" },
      { name: "anxiety-support", category: "Mental Health Support" },
      { name: "depression-talk", category: "Mental Health Support" },
      { name: "calm-corner", category: "Mental Health Support" },
      
      // General & Social
      { name: "general-chat", category: "General & Social" },
      { name: "introduce-yourself", category: "General & Social" },
      { name: "daily-gratitude", category: "General & Social" },
      { name: "affirmation-drops", category: "General & Social" },
      
      // Habits & Routines
      { name: "habit-builder", category: "Habits & Routines" },
      { name: "sleep-club", category: "Habits & Routines" },
      
      // Motivation & Progress
      { name: "goal-setting", category: "Motivation & Progress" },
      { name: "relapse-and-restart", category: "Motivation & Progress" },
      { name: "progress-pings", category: "Motivation & Progress" },
    ];

    await Community.insertMany(defaultChannels);
    console.log("Default channels initialized - clean start");
    
    
  } catch (error) {
    console.error("Error initializing channels:", error);
  }
};



module.exports = {
  getChannels,
  getChannelMessages,
  sendMessage,
  initializeChannels,
}; 