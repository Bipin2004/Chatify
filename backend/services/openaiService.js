// backend/services/openaiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * askGemini() - Non-streaming
 * Send userMessage to Google Gemini and wait for the full response.
 */
async function askGemini(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in askGemini:', error);
    throw error;
  }
}

/**
 * askGeminiStream() - Streaming with vision support
 * Creates a stream from the Gemini API.
 * @param {Array<Object>} messages - The full conversation history for context.
 * @returns {Promise<Stream>} - A stream object from the API.
 */
async function askGeminiStream(messages) {
  try {
    // Validate API key and model
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    if (!process.env.GEMINI_MODEL) {
      throw new Error('GEMINI_MODEL is not configured');
    }
    
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
    
    // Get the latest message (the one we're responding to)
    const latestMessage = messages[messages.length - 1];
    
    if (!latestMessage) {
      throw new Error('No message provided');
    }
    
    // Build conversation history as context
    const conversationHistory = messages.slice(0, -1).map(msg => 
      `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`
    ).join('\n');
    
    let prompt = '';
    let imageParts = [];
    
    // Add conversation context if exists
    if (conversationHistory) {
      prompt += `Previous conversation:\n${conversationHistory}\n\nCurrent message:\n`;
    }
    
    // Handle image + text message
    if (latestMessage.hasImage && latestMessage.imageData) {
      prompt += latestMessage.content || "What do you see in this image?";
      
      // Add image part for vision
      imageParts.push({
        inlineData: {
          data: latestMessage.imageData,
          mimeType: "image/jpeg"
        }
      });
      
      const result = await model.generateContentStream([prompt, ...imageParts]);
      return result.stream;
    } else {
      // Text-only message
      prompt += latestMessage.content;
      const result = await model.generateContentStream(prompt);
      return result.stream;
    }
  } catch (error) {
    console.error('Error in askGeminiStream:', error);
    console.error('Model being used:', process.env.GEMINI_MODEL);
    console.error('API Key present:', !!process.env.GEMINI_API_KEY);
    throw error;
  }
}

module.exports = { askGemini, askGeminiStream };
