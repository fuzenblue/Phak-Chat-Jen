import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * POST /api/gemini/chat
 * Send a prompt to Gemini AI and get a response
 */
router.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!genAI) {
            return res.status(500).json({
                error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in .env file.',
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const reply = response.text();

        res.json({
            reply,
            model: 'gemini-2.0-flash',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        res.status(500).json({
            error: 'Failed to get response from Gemini AI',
            details: error.message,
        });
    }
});

export default router;
