const express = require('express');
const router = express.Router();
const { translateText } = require('../services/translationService');

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const translated = await translateText(text);
    res.json({ translated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
