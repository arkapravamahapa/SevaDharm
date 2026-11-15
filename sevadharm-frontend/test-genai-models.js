import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing VITE_GEMINI_API_KEY or GEMINI_API_KEY in environment or .env file.");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

