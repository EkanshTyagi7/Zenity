const Quotes = require("inspirational-quotes");

exports.getQuote = (req, res) => {
  const quote = Quotes.getQuote();
  res.json(quote);
};