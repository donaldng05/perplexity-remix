const express = require('express');
const router = express.Router();
const { translateText } = require('../services/translationService');
const { enrichLyricsWithSonar } = require('../services/sonarService');
const { alignSyllables } = require('../services/alignmentService');

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  try {
    const translated = await translateText(text);
    const enrichmentRaw = await enrichLyricsWithSonar(translated);

    const enrichment = enrichmentRaw.choices?.[0]?.message?.content || 'No explanation found.';

    const alignment = await alignSyllables(text, translated);
    res.json({
      translated,
      enrichment,
      alignment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
