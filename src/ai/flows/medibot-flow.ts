
'use server';
/**
 * @fileOverview An AI chatbot flow for Sanjiwani Health.
 *
 * - chatWithMediBot: A function to handle conversational chat.
 * - MediBotInput: The input type for the chat flow.
 * - MediBotOutput: The return type for the chat flow.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const MediBotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  query: z.string().describe('The latest user query.'),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

const MediBotOutputSchema = z.object({
  response: z.string().describe('The AI bot\'s response.'),
});
export type MediBotOutput = z.infer<typeof MediBotOutputSchema>;


export async function chatWithMediBot(input: MediBotInput): Promise<MediBotOutput> {
  return await mediBotFlow(input);
}

const mediBotPrompt = ai.definePrompt({
    name: 'mediBotPrompt',
    input: { schema: MediBotInputSchema },
    output: { schema: MediBotOutputSchema },
    model: googleAI.model('gemini-1.5-flash-preview'),
    prompt: `You are MediBot, a friendly and helpful AI assistant for the Sanjiwani Health application.
Your goal is to answer user questions about the app's services, help them navigate features, and provide general health-related information.

**Your Capabilities:**
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
Based on the conversation history and the new user question, generate a helpful and relevant response. Address the user's query directly and courteously.
`,
});

const mediBotFlow = ai.defineFlow(
  {
    name: 'mediBotFlow',
    inputSchema: MediBotInputSchema,
    outputSchema: MediBotOutputSchema,
  },
  async (input) => {
    const { output } = await mediBotPrompt(input);
    if (!output) {
      return { response: "I'm sorry, I couldn't process that. Could you please rephrase?" };
    }
    return output;
  }
);
