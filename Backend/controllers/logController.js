const DailyLog = require("../models/DailyLog");
const User = require("../models/User");

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

exports.saveLog = async (req, res) => {
  try {
    const { userId, date } = req.body;
    const existing = await DailyLog.findOne({ userId, date });

    if (existing) {
      await DailyLog.updateOne({ userId, date }, req.body);
      return res.status(200).json({ message: "Log updated" });
    }

    const newLog = new DailyLog(req.body);
    await newLog.save();

    await updateUserStreaks(userId, date);
    
    const levelUpResult = await addXPAndHandleLevelUp(userId, 5);

    const user = await User.findById(userId);
    if (user) {
      user.coins += 50;
      user.stars += 30;
      await user.save();
    }

    res.status(201).json({ 
      message: "Log saved",
      xpAwarded: 5,
      leveledUp: levelUpResult?.leveledUp || false,
      newLevel: levelUpResult?.newLevel,
      newXP: levelUpResult?.newXP,
      coinsAwarded: 50,
      starsAwarded: 30,
      remainingCoins: user.coins,
      remainingStars: user.stars
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
};

async function updateUserStreaks(userId, currentDate) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date(currentDate);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayLog = await DailyLog.findOne({ userId, date: currentDate });
    
    if (todayLog) {
      if (user.lastLogDate === yesterdayStr) {
        user.currentStreak += 1;
      } else if (user.lastLogDate !== currentDate) {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.highestStreak) {
        user.highestStreak = user.currentStreak;
      }

      user.lastLogDate = currentDate;
      await user.save();
    }
  } catch (err) {
    console.error("Error updating streaks:", err);
  }
}

exports.getLogByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const log = await DailyLog.findOne({ userId, date });
    res.status(200).json(log);
  } catch {
    res.status(500).json({ error: "Failed to fetch log" });
  }
};

exports.getUserStreaks = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayLog = await DailyLog.findOne({ userId, date: todayStr });
    let currentStreak = user.currentStreak;

    if (!todayLog) {
      if (user.lastLogDate === yesterdayStr) {
      } else if (user.lastLogDate !== todayStr) {
        if (user.currentStreak > user.highestStreak) {
          user.highestStreak = user.currentStreak;
        }
        currentStreak = 0;
        user.currentStreak = 0;
        await user.save();
      }
    }

    res.status(200).json({
      currentStreak,
      highestStreak: user.highestStreak
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch streaks" });
  }
};
