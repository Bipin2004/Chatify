// backend/services/geminiService.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL
});

/**
 * askGemini()
 * Send userMessage to Google Gemini via
 * the Generative Language “/openai” endpoint.
 */
async function askGemini(userMessage) {
  const response = await openai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [{ role: 'user', content: userMessage }]
  });
  return response.choices?.[0]?.message?.content ?? '';
}

module.exports = { askGemini };
