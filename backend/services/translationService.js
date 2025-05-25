const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Load credentials from .env
const key = process.env.AZURE_TRANSLATOR_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT; // e.g. https://api.cognitive.microsofttranslator.com
const location = 'southeastasia'; // hardcoded here, or use process.env if dynamic

async function translateText(text, from = 'vi', to = 'en') {
  try {
    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString(),
      },
      params: {
        'api-version': '3.0',
        from,
        to,
      },
      data: [
        { text }
      ],
      responseType: 'json',
    });

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Azure Translator error:', error.response?.data || error.message);
    throw new Error('Failed to translate text.');
  }
}

module.exports = { translateText };
