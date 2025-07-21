const mongoose = require("mongoose");

const dailyQuoteSchema = new mongoose.Schema({
  date: {
    type: String,
    unique: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  author: String,
});

const DailyQuote = mongoose.model("DailyQuote", dailyQuoteSchema);

module.exports = DailyQuote;
