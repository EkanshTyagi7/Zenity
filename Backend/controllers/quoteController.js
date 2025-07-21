const quote = require("inspirational-quotes");
const DailyQuote = require("../models/DailyQuote");

const getDailyQuote = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    
    let todayQuote = await DailyQuote.findOne({ date: today });

    if (!todayQuote) {
      const newQuote = quote.getQuote();
      todayQuote = await DailyQuote.create({
        date: today,
        text: newQuote.text,
        author: newQuote.author || "Unknown",
      });
    }

    res.json({
      text: todayQuote.text,
      author: todayQuote.author,
    });
  } catch (err) {
    console.error("Error getting daily quote:", err);
    res.status(500).json({ error: "Failed to get daily quote" });
  }
};

module.exports = { getDailyQuote };
