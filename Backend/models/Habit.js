const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    totalDays: { type: Number, required: true },
    completedDays: [String],
    startDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
