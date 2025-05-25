const express = require('express');
const router = express.Router();
const { enrichLyricsWithSonar } = require('../services/sonarService');

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const enrichment = await enrichLyricsWithSonar(text);
    res.json({ enrichment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
