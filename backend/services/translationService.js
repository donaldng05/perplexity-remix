const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const key = process.env.AZURE_TRANSLATOR_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT; // e.g. ends with /
const location = 'southeastasia';

async function translateText(text, from = 'vi', to = 'en') {
  const url = `${endpoint}translate?api-version=3.0&from=${from}&to=${to}`;

  // 🔍 Debug print
  console.log("DEBUG: Azure URL =", url);
  console.log("DEBUG: Azure Key =", key ? "✅ Exists" : "❌ MISSING");
  console.log("DEBUG: Azure Endpoint =", endpoint);

  try {
    const response = await axios.post(
      url,
      [{ text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': location,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString(),
        },
        responseType: 'json',
      }
    );

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Azure Translator error:', error.response?.data || error.message);
    throw new Error('Failed to translate text.');
  }
}

module.exports = { translateText };
