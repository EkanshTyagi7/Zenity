const Community = require("../models/Community");
const User = require("../models/User");

// Get all channels grouped by category
const getChannels = async (req, res) => {
  try {
    const channels = await Community.find().populate("messages.user", "name");
    
    // Group channels by category
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

// Get messages for a specific channel
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

// Send a message to a channel
const sendMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // From auth middleware

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

    // Populate user info for the new message
    const populatedChannel = await Community.findById(channelId).populate("messages.user", "name");
    const savedMessage = populatedChannel.messages[populatedChannel.messages.length - 1];

    res.json({ success: true, message: savedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initialize default channels
const initializeChannels = async () => {
  try {
    const existingChannels = await Community.find();
    if (existingChannels.length > 0) {
      // Clear all existing channels and messages for fresh start
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
    
    // Sample messages removed - clean start
    // await addSampleMessages();
  } catch (error) {
    console.error("Error initializing channels:", error);
  }
};

// Sample messages function removed
// const addSampleMessages = async () => {
//   try {
//     // Get a sample user or create one for demo purposes
//     let sampleUser = await User.findOne();
//     if (!sampleUser) {
//       // Create a demo user if none exists
//       sampleUser = await User.create({
//         name: "Zenity Bot",
//         email: "bot@zenity.com",
//         password: "demo123"
//       });
//     }

//     const channels = await Community.find();
    
//     // Add sample messages to different channels
//     const sampleMessages = [
//       {
//         channelName: "general-chat",
//         messages: [
//           "Welcome to Zenity Community! 🌱",
//           "How is everyone doing today?",
//           "Remember to take care of yourselves! 💚"
//         ]
//       },
//       {
//         channelName: "daily-gratitude",
//         messages: [
//           "Today I'm grateful for this supportive community 🙏",
//           "Grateful for the sunshine and fresh air today ☀️",
//           "Thankful for small moments of peace and quiet"
//         ]
//       },
//       {
//         channelName: "habit-builder",
//         messages: [
//           "What habits are you working on this week?",
//           "Consistency is key! Keep going! 💪",
//           "Remember, progress over perfection"
//         ]
//       }
//     ];

//     for (const sample of sampleMessages) {
//       const channel = channels.find(c => c.name === sample.channelName);
//       if (channel) {
//         for (const messageText of sample.messages) {
//           channel.messages.push({
//             user: sampleUser._id,
//             content: messageText,
//             timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24 hours
//           });
//         }
//         await channel.save();
//       }
//     }
    
//     console.log("Sample messages added to channels");
//   } catch (error) {
//     console.error("Error adding sample messages:", error);
//   }
// };

module.exports = {
  getChannels,
  getChannelMessages,
  sendMessage,
  initializeChannels,
}; 