const quote = require("inspirational-quotes");

let lastQuote = null;
let lastDate = null;

const getDailyQuote = (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  if (lastDate !== today) {
    lastQuote = quote.getQuote();
    lastDate = today;
  }

  // Clean up quote and author
  let text = lastQuote.text || "";
  let author = lastQuote.author || "";

  // If author is missing but text contains a dash, try to split
  if (!author && text.includes(" - ")) {
    const parts = text.split(" - ");
    text = parts[0].replace(/^["']|["']$/g, "").trim();
    author = parts[1].replace(/^["']|["']$/g, "").trim();
  } else {
    text = text.replace(/^["']|["']$/g, "").trim();
    author = author.replace(/^["']|["']$/g, "").trim();
  }

  res.json({
    text,
    author: author || "Unknown",
  });
};

module.exports = { getDailyQuote };