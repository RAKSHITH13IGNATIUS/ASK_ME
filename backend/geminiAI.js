// Gemini AI Integration
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

// Check if API key is configured
if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️  Gemini API key not configured. AI responses will be disabled.');
    console.warn('   Get your free API key at: https://makersuite.google.com/app/apikey');
}

let genAI = null;
let model = null;

// Initialize Gemini AI if API key is available
if (apiKey && apiKey.trim() !== '') {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log('✓ Gemini AI initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error.message);
    }
}

// Campus context for better AI responses
const CAMPUS_CONTEXT = `
You are ASK DSU, a friendly Gen-Z campus assistant chatbot for DSU (Dayananda Sagar University).

Your role:
- Help students with campus-related questions
- Provide information about facilities, academics, campus life
- Be conversational, helpful, and have a Gen-Z personality (casual but professional)
- Keep responses concise and to the point
- Use emojis occasionally but not excessively

What you know:
- DSU has multiple blocks (A, B, C, D) with classrooms
- There's a library with seating capacity
- Faculty members have cabin numbers in different blocks
- The campus has computer labs, auditoriums, and study spaces

Response style:
- Be friendly and conversational
- Use "bruh", "ngl" (not gonna lie), "fr" (for real) sparingly
- Keep it professional enough for a campus assistant
- Don't make up specific information you don't know
- If you don't know something specific, suggest asking campus administration

Important:
- If asked about specific classroom numbers, library seats, or faculty locations, say "Let me check the database for you" and explain the chatbot can help with that
- Don't make up fake data about classrooms or faculty
- Keep responses under 150 words
`;

/**
 * Generate AI response using Gemini
 * @param {string} userQuery - The user's question
 * @returns {Promise<string>} - AI-generated response
 */
async function generateAIResponse(userQuery) {
    // If AI is not configured, return helpful message
    if (!model) {
        return "I'm an AI assistant, but I'm currently not configured. Ask me about free classrooms, library status, or faculty locations - I can help with those!";
    }

    try {
        const prompt = `${CAMPUS_CONTEXT}\n\nUser question: ${userQuery}\n\nYour response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Gemini AI error:', error.message);

        // Handle specific errors
        if (error.message.includes('API_KEY_INVALID')) {
            return "AI is not properly configured. Please check the API key. Meanwhile, ask me about classrooms, library, or faculty!";
        }

        if (error.message.includes('quota')) {
            return "AI is currently at capacity. Try asking about free classrooms, library status, or faculty locations instead!";
        }

        return "I couldn't process that with AI right now, but I can help you find free classrooms, check library status, or locate faculty. What do you need?";
    }
}

/**
 * Check if AI is available
 * @returns {boolean}
 */
function isAIAvailable() {
    return model !== null;
}

module.exports = {
    generateAIResponse,
    isAIAvailable
};
