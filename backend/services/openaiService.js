// backend/services/openaiService.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL
});

/**
 * askGemini() - Non-streaming
 * Send userMessage to Google Gemini and wait for the full response.
 */
async function askGemini(userMessage) {
  const response = await openai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [{ role: 'user', content: userMessage }]
  });
  return response.choices?.[0]?.message?.content ?? '';
}

/**
 * askGeminiStream() - Streaming
 * Creates a stream from the Gemini API.
 * @param {Array<Object>} messages - The full conversation history for context.
 * @returns {Promise<Stream>} - A stream object from the API.
 */
async function askGeminiStream(messages) {
  return openai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: messages, // Use the full history for context
    stream: true,
  });
}

module.exports = { askGemini, askGeminiStream };
