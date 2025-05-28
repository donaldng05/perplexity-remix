const express = require('express');
const svc     = require('../services/remixService');
const router  = express.Router();

// GET /api/remixes
router.get('/', async (req, res, next) => {
  try {
    const all = await svc.listAllRemixes();
    res.json(all);
  } catch (err) {
    next(err);
  }
});

// GET /api/remixes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const remix = await svc.getRemixMetadata(req.params.id);
    if (!remix) return res.sendStatus(404);
    res.json(remix);
  } catch (err) {
    next(err);
  }
});

// GET /api/remixes/:id/ocr
router.get('/:id/ocr', async (req, res, next) => {
  try {
    const ocr = await svc.getOcrLines(req.params.id);
    res.json(ocr);
  } catch (err) {
    next(err);
  }
});

// GET /api/remixes/:id/stt
router.get('/:id/stt', async (req, res, next) => {
  try {
    const stt = await svc.getSttLines(req.params.id);
    res.json(stt);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
