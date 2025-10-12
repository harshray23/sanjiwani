'use server';
/**
 * @fileOverview A conversational AI flow for the MediBot assistant.
 * - streamChat: A streaming flow that takes chat history and a new query,
 *   and yields the AI's response in chunks.
 * - MediBotInput: The Zod schema for the flow's input.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the MediBot flow.
const MediBotInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  query: z.string(),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;


const mediBotSystemPrompt = `
You are Sanjiwani Health Assistant, a friendly and helpful AI assistant for a healthcare application.
Your goal is to provide helpful, safe, and informative guidance on healthcare topics, services offered by the Sanjiwani Health platform, and assist users with tasks like finding doctors or booking appointments.

**IMPORTANT RULES:**
- **DO NOT PROVIDE MEDICAL ADVICE.** Never diagnose conditions, prescribe medication, or suggest specific treatments.
- Always preface any health-related information with a clear disclaimer: "As an AI assistant, I cannot provide medical advice. Please consult with a qualified healthcare professional for any health concerns."
- If the user seems to be in an emergency, your immediate and only response should be to advise them to contact local emergency services.
- Your knowledge is based on your training data. You are not a real doctor.
`;

/**
 * The main exported function that clients will call to stream chat responses.
 * It takes chat history and a user query, and returns an async generator
 * that yields the response text in chunks.
 */
export async function* streamChat(input: MediBotInput): AsyncGenerator<string> {

  // 1. Defensive Coercion & Validation
  const validatedInput = MediBotInputSchema.parse({
    history: Array.isArray(input.history) ? input.history.map(h => ({ ...h, content: String(h.content || '') })) : [],
    query: String(input.query || '')
  });

  // 2. Build the message history in the format the AI model expects.
  // Map 'model' role to 'assistant' for compatibility.
  const messages = [
    { role: 'system', content: mediBotSystemPrompt },
    ...validatedInput.history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: [{text: h.content}],
    })),
    { role: 'user', content: [{text: validatedInput.query}] },
  ];

  try {
    // 3. Call the AI model with the correctly structured prompt.
    const { stream } = await ai.generateStream({
      model: 'gemini-1.5-flash',
      prompt: { messages },
    });

    // 4. Yield each chunk of text as it is received.
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (err: any) {
    console.error('AI prompt error in medibot-flow:', err);
    // Provide a user-friendly error message in the stream
    yield "I'm sorry, but I encountered an error and can't respond right now. Please try again later.";
  }
}

    