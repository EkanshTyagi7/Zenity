const DailyLog = require("../models/DailyLog");

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
    res.status(201).json({ message: "Log saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
};

exports.getLogByDate = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const log = await DailyLog.findOne({ userId, date });
    res.status(200).json(log);
  } catch {
    res.status(500).json({ error: "Failed to fetch log" });
  }
};
