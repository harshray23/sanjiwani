/**
 * @fileoverview Initializes a shared `ai` instance using Genkit.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    '⚠️ GEMINI_API_KEY not set. AI-powered features may fail. Add it in your .env file.'
  );
}

const googleAiPlugin = googleAI();

// Initialize Genkit with plugins (telemetry is automatic)
export const ai = genkit({
  plugins: [googleAiPlugin],
});
