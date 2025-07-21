const express = require("express");
const { getQuote } = require("../controllers/quoteController");

const router = express.Router();

router.get("/", getQuote);

module.exports = router;
