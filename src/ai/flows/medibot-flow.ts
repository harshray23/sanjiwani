
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
import type {GenerateResultChunk} from 'genkit';


const MediBotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  query: z.string().describe('The latest user query.'),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

export async function streamChat(input: MediBotInput): Promise<AsyncGenerator<string>> {
  return mediBotStreamFlow(input);
}

const mediBotPrompt = {
    name: 'mediBotPrompt',
    input: { schema: MediBotInputSchema },
    model: googleAI.model('gemini-1.5-flash'),
    prompt: `You are MediBot, a friendly and helpful AI assistant for the Sanjiwani Health application.
Your goal is to answer user questions about the app's services, help them navigate features, and provide general health-related information.

**Response Rules:**
1.  If the user's query is a simple greeting like "Hi", "Hlo", "Hello", etc. (case-insensitive), your response MUST be: "Hlo, I am MediBot, an AI assistant of Sanjiwani. How can I help you today?"
2.  If the user asks about the services of Sanjiwani Health (e.g., "Tell me about your services", "what services do you provide?"), provide a summary of the following services: Finding Doctors & Clinics, Booking Appointments (in-clinic and video), Locating Hospitals with bed availability, Finding Diagnostics Centers for tests, and Emergency Service guidance.
3.  For all other questions, use your general capabilities.

**Your General Capabilities:**
- Answer questions about finding doctors, clinics, hospitals, and diagnostic centers.
- Explain how to book appointments, including video consultations and in-clinic visits.
- Provide information on emergency services and how to find them.
- Explain features like prescription cashback and setting medicine reminders.
- Offer general, non-prescriptive health and wellness advice. **Never provide a diagnosis or medical advice.** Always advise users to consult a qualified doctor for medical concerns.
- Be empathetic, clear, and concise.

**Conversation History:**
{{#each history}}
- **{{role}}**: {{{content}}}
{{/each}}

**New User Question:**
- **user**: {{{query}}}

**Your Task:**
Based on the rules, conversation history, and the new user question, generate a helpful and relevant response. Address the user's query directly and courteously.
`,
};

const mediBotStreamFlow = ai.defineFlow(
  {
    name: 'mediBotStreamFlow',
    inputSchema: MediBotInputSchema,
  },
  async function* (input) {
    const { stream } = ai.generateStream({
        ...mediBotPrompt,
        input: input,
    });
    
    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
);
