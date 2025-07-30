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
    coins: {
      type: Number,
      default: 1250  // Default starting coins
    },
    stars: {
      type: Number,
      default: 45    // Default starting stars
    },
    unlockedItems: {
      type: [
        {
          itemId: Number,
          itemType: {
            type: String,
            enum: ["avatar", "pet", "theme"]
          }
        }
      ],
      default: [
        { itemId: 1, itemType: "avatar" },
        { itemId: 1, itemType: "pet" },
        { itemId: 1, itemType: "theme" }
      ]
    },
    equippedItems: {
      avatar: { type: Number, default: 1 },  // Default equipped items
      pet: { type: Number, default: 1 },
      theme: { type: Number, default: 1 }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
