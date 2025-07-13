import { config } from 'dotenv';

config();

export const geminiApiKey = process.env.GEMINI_API_KEY;
export const mistralApiKey = process.env.MISTRAL_API_KEY;
