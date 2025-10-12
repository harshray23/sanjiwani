
'use server';
import { ai } from '@/ai/genkit';
import { Message } from 'genkit';
import { z } from 'zod';

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

export async function* streamChat(input: MediBotInput): AsyncGenerator<string> {
  // Defensive coercion and validation
  const validatedInput = MediBotInputSchema.parse({
    history: Array.isArray(input.history)
      ? input.history.map(h => ({ ...h, content: String(h.content || '').trim() }))
      : [],
    query: String(input.query || '').trim(),
  });

  const messages = [
    { role: 'system', content: [{ text: mediBotSystemPrompt }] },
    ...validatedInput.history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: [{ text: h.content }],
    })),
    { role: 'user', content: [{ text: validatedInput.query }] },
  ];

  try {
    const { stream, response } = ai.generateStream({
      model: 'gemini-1.5-flash',
      prompt: 'message'
    });

    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (err: any) {
    console.error('AI prompt error in medibot-flow. Prompt shape:', {
      messageCount: messages.length,
      roles: messages.map(m => m.role)
    }, 'Error:', err.message);
    yield "I'm sorry, but I encountered an error and can't respond right now. Please try again later.";
  }
}
