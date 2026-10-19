const express = require('express');
const router = express.Router();
const surveyService = require('../services/surveyService');

// GET /surveys - Danh sách khảo sát (M2/M3)
router.get('/', async (req, res) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.json({ success: true, data: surveys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /surveys - Gửi khảo sát mới (M1)
router.post('/', async (req, res) => {
  try {
    const result = await surveyService.submitSurvey(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;