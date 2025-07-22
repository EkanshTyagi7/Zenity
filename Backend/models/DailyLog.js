const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    mood: Number,
    anxiety: Number,
    stress: Number,
    energy: Number,
    sleep: {
      hours: Number,
      quality: Number,
    },
    symptoms: [String],
    activities: [String],
    gratitude: [String],
    medications: [String],
    notes: String,
    triggers: String,
    achievements: String,
    socialInteraction: Number,
    physicalActivity: Number,
    productivity: Number,
    mindfulness: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyLog", dailyLogSchema);
