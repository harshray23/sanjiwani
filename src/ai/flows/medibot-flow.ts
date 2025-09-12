
'use server';
/**
 * @fileOverview A streaming AI chatbot flow for the Medi+Bot assistant.
 *
 * - streamChat: Handles conversational chat with streaming responses.
 * - MediBotInput: The input schema for the chat flow.
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

const mediBotPrompt = `You are Medi+Bot, a friendly and helpful AI assistant for the Sanjiwani Health application.
Your goal is to answer user questions about the app's services, help them navigate features, and provide general health-related information.

When asked about the services of Sanjiwani Health (e.g., "Tell me about your services", "what services do you provide?"), provide a summary of the following services: Finding Doctors & Clinics, Booking Appointments (in-clinic and video), Locating Hospitals with bed availability, Finding Diagnostics Centers for tests, and Emergency Service guidance.

When asked how to book an appointment (e.g., "How do I book an appointment?"), explain the following steps clearly:
1.  **Find Your Doctor:** Use the search bar on the homepage or go to the "Find Doctors" section to search by name, specialty, or location.
2.  **Select a Time Slot:** On the doctor's profile page, choose an available time slot for an in-clinic visit that works for you.
3.  **Confirm & Pay:** Complete the secure payment process to instantly confirm your appointment. You will receive a unique token for your visit.
For video consultations, you can request one directly from the doctor's page.

For all other questions, use your general capabilities to be helpful. Never provide a medical diagnosis; always advise users to consult a qualified doctor.

Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

New User Question:
- user: {{{query}}}

Your Task:
Based on the conversation history and the new user question, generate a helpful and relevant response. Address the user's query directly and courteously.
`;

const mediBotStreamFlow = ai.defineFlow(
  {
    name: 'mediBotStreamFlow',
    inputSchema: MediBotInputSchema,
  },
  async function* (input) {
    const normalizedQuery = input.query.trim().toLowerCase();
    const greetings = ['hi', 'hlo', 'hello'];

    // Check if it's the first user message and it's a greeting
    if (input.history.length === 1 && greetings.includes(normalizedQuery)) {
      yield 'Hlo, I am Medi+Bot, an AI assistant of Sanjiwini. How can I assist you today?';
      return;
    }

    const { stream } = ai.generateStream({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: {
        text: mediBotPrompt,
        input: input,
      },
    });

    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
);
