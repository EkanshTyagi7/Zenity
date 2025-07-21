const express = require("express");
const router = express.Router();
const {
  getAllHabits,
  createHabit,
  updateHabit,
  toggleHabitDay,
} = require("../controllers/habitController");

router.get("/", getAllHabits);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.patch("/:id/toggle", toggleHabitDay);

module.exports = router;
