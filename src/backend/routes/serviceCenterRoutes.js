const express = require('express');
const service = require('../services/serviceCenterService');

const router = express.Router();

function respondError(res, error) {
  if (error.status) {
    return res.status(error.status).json({ success: false, code: error.code, error: error.message });
  }
  console.error('Service-center API failed:', error.message);
  return res.status(500).json({ success: false, error: 'Không thể xử lý yêu cầu trung tâm bảo hành' });
}

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: await service.findAll() });
  } catch (error) {
    respondError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.json({ success: true, data: await service.findById(req.params.id) });
  } catch (error) {
    respondError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json({ success: true, data: await service.create(req.body) });
  } catch (error) {
    respondError(res, error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    res.json({ success: true, data: await service.update(req.params.id, req.body) });
  } catch (error) {
    respondError(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await service.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    respondError(res, error);
  }
});

module.exports = router;
