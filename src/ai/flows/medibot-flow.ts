
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
import { streamToAsyncGenerator } from '@/lib/utils';

const MediBotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  query: z.string().describe('The latest user query.'),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

export async function streamChat(input: MediBotInput): Promise<AsyncGenerator<string>> {
  const stream = await mediBotStreamFlow(input);
  return streamToAsyncGenerator(stream);
}

const mediBotPrompt = {
    name: 'mediBotPrompt',
    input: { schema: MediBotInputSchema },
    model: googleAI.model('gemini-1.5-flash'),
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
};

const mediBotStreamFlow = ai.defineFlow(
  {
    name: 'mediBotStreamFlow',
    inputSchema: MediBotInputSchema,
    outputSchema: z.string(), // We're streaming a string now
  },
  async (input) => {
    const { stream } = ai.generateStream({
        ...mediBotPrompt,
        prompt: mediBotPrompt.prompt, // Pass the prompt template string
        input: input, // Pass the actual data
        stream: true,
    });
    
    // We will return a ReadableStream of text chunks
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk.text);
        }
        controller.close();
      },
    });
  }
);
