const express = require("express");
const { getDailyQuote } = require("../controllers/quoteController");

const router = express.Router();

router.get("/", getDailyQuote);

module.exports = router;
