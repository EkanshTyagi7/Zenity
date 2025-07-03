const express = require("express");

//require controllers
const {
  handleUserSignUp,
  handleUserSignIn,
} = require("../controllers/authController");

//require router
const router = express.Router();

router.post("/signup", handleUserSignUp);
router.post("/signin", handleUserSignIn);

module.exports = router;
