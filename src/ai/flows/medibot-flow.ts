
'use server';
/**
 * @fileOverview An AI chatbot flow for Sanjiwani Health.
 *
 * - streamChat: A function to handle conversational chat with streaming.
 * - MediBotInput: The input type for the chat flow.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const MediBotInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  query: z.string().describe('The latest user query.'),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

export async function streamChat(
  input: MediBotInput
): Promise<AsyncGenerator<string>> {
  return mediBotStreamFlow(input);
}

const mediBotPrompt = ai.definePrompt({
  name: 'mediBotPrompt',
  input: { schema: MediBotInputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are MediBot, a friendly and helpful AI assistant for the Sanjiwani Health application.
Your goal is to answer user questions about the app's services, help them navigate features, and provide general health-related information.

When asked about the services of Sanjiwani Health (e.g., "Tell me about your services", "what services do you provide?"), provide a summary of the following services: Finding Doctors & Clinics, Booking Appointments (in-clinic and video), Locating Hospitals with bed availability, Finding Diagnostics Centers for tests, and Emergency Service guidance.

For all other questions, use your general capabilities to be helpful. Never provide a medical diagnosis; always advise users to consult a qualified doctor.

Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

New User Question:
- user: {{{query}}}

Your Task:
Based on the conversation history and the new user question, generate a helpful and relevant response. Address the user's query directly and courteously.
`,
});

const mediBotStreamFlow = ai.defineFlow(
  {
    name: 'mediBotStreamFlow',
    inputSchema: MediBotInputSchema,
  },
  async function* (input) {
    // AI model is now responsible for all responses, including greetings.
    const { stream } = ai.generateStream({
      prompt: mediBotPrompt,
      input: input,
    });

    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
);
