const axios = require('axios');

async function enrichLyricsWithSonar(text) {
  const url = 'https://api.perplexity.ai/chat/completions';
  const headers = {
    'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const data = {
    model: 'sonar',
    messages: [
      {
        role: 'system',
        content: 'You are a cultural analyst. Provide context and meaning for the following lyrics.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Sonar API error:', error.response?.data || error.message);
    throw new Error('Failed to enrich text with Sonar.');
  }
}

module.exports = { enrichLyricsWithSonar };
