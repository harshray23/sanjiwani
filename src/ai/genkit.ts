/**
 * @fileoverview This file initializes and a shared `ai` instance that can be used across the application.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY environment variable not set. AI-powered features may fail. Please set this in your .env file.');
}

// Initialize the Google AI plugin.
// By not passing an API key here, the plugin will automatically
// use the `GEMINI_API_KEY` environment variable.
const googleAiPlugin = googleAI();

// Configure Genkit with the necessary plugins.
// The `ai` object is the main entry point for using Genkit's features.
export const ai = genkit({
  plugins: [googleAiPlugin],
  // Log all traces to the Firebase console.
  enableTracing: true,
  // By default, traces are not logged in production.
  // You can force tracing by setting this to true.
  // forceTracing: true,
});
