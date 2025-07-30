const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const DailyLog = require('../models/DailyLog');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/save', logController.saveLog);
router.get('/get', logController.getLogByDate);

// Get latest (or previous) daily log for the logged-in user
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find the most recent log (sort by date descending)
    const log = await DailyLog.findOne({ userId }).sort({ date: -1 });
    if (!log) {
      return res.json({ success: true, log: null });
    }
    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
