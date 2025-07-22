const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/save', logController.saveLog);
router.get('/get', logController.getLogByDate);

module.exports = router;
