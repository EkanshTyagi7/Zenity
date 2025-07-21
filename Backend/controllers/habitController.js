const Habit = require('../models/Habit');

exports.getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createHabit = async (req, res) => {
  try {
    const { name, totalDays, startDate } = req.body;
    const newHabit = new Habit({
      name,
      totalDays,
      startDate,
      completedDays: []
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateHabit = async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.toggleHabitDay = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const today = new Date().toISOString().split("T")[0];
    const index = habit.completedDays.indexOf(today);

    if (index > -1) {
      habit.completedDays.splice(index, 1);
    } else {
      habit.completedDays.push(today);
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
