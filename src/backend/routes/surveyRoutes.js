const express = require('express');
const router = express.Router();
const surveyService = require('../services/surveyService');

function respondError(res, err) {
  if (err.status) {
    return res.status(err.status).json({ success: false, code: err.code, error: err.message });
  }
  if (err.code === '23505') {
    return res.status(409).json({ success: false, code: 'DUPLICATE_SURVEY', error: 'Phiếu này đã được gửi khảo sát' });
  }
  console.error('Survey API failed:', err.message);
  return res.status(500).json({ success: false, error: 'Không thể xử lý khảo sát lúc này' });
}

router.get('/stats', async (req, res) => {
  try {
    const stats = await surveyService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    respondError(res, err);
  }
});

// GET /surveys - Danh sách khảo sát (M2/M3)
router.get('/', async (req, res) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.json({ success: true, data: surveys });
  } catch (err) {
    respondError(res, err);
  }
});

// POST /surveys - Gửi khảo sát mới (M1)
router.post('/', async (req, res) => {
  try {
    const result = await surveyService.submitSurvey(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    respondError(res, err);
  }
});

module.exports = router;