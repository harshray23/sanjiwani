/**
 * @fileoverview This file initializes and configures the Genkit AI plugin.
 * It creates a single, shared `ai` instance that can be used across the application.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize the Google AI plugin.
const googleAiPlugin = googleAI({
    // You can specify your API key here if it's not set in an environment variable
    // apiKey: process.env.GEMINI_API_KEY,
});

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
