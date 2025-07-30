//require mongoose for creating schema and model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    highestStreak: {
      type: Number,
      default: 0,
    },
    lastLogDate: {
      type: String, // YYYY-MM-DD format
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 300,
    },
    stars: {
      type: Number,
      default: 250,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
