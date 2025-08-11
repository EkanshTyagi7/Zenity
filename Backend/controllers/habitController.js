const Habit = require('../models/Habit');
const User = require('../models/User');

async function addXPAndHandleLevelUp(userId, xpToAdd) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let xp = user.xp + xpToAdd;
    let level = user.level;
    let leveledUp = false;

    while (level < 10 && xp >= level * 100) {
      xp -= level * 100;
      level += 1;
      leveledUp = true;
    }

    if (level >= 10) {
      level = 10;
      xp = 0;
    }

    user.xp = xp;
    user.level = level;
    await user.save();
    
    return { leveledUp, newLevel: level, newXP: xp };
  } catch (err) {
    console.error("Error updating XP/level:", err);
  }
}

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
    const userId = req.body.userId; 

    let wasCompleted = false;
    let xpChange = 0;
    let coinsAwarded = 0;
    let starsAwarded = 0;

    if (index > -1) {
      habit.completedDays.splice(index, 1);
      xpChange = -2;
      coinsAwarded = -10;
      starsAwarded = -5;
      wasCompleted = false;
    } else {
      habit.completedDays.push(today);
      xpChange = 2;
      coinsAwarded = 10;
      starsAwarded = 5;
      wasCompleted = true;
    }

    await habit.save();

    
    let levelUpResult = null;
    let user = null;
    if (userId && (xpChange !== 0 || coinsAwarded !== 0 || starsAwarded !== 0)) {
      levelUpResult = await addXPAndHandleLevelUp(userId, xpChange);
      
      
      user = await User.findById(userId);
      if (user) {
        user.coins = Math.max(0, user.coins + coinsAwarded);
        user.stars = Math.max(0, user.stars + starsAwarded);
        await user.save();
      }
    }

    res.json({
      habit,
      xpChange,
      wasCompleted,
      leveledUp: levelUpResult?.leveledUp || false,
      newLevel: levelUpResult?.newLevel,
      newXP: levelUpResult?.newXP,
      coinsAwarded,
      starsAwarded,
      remainingCoins: user?.coins,
      remainingStars: user?.stars
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
