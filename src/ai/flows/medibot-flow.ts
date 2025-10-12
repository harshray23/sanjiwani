'use server';

import { ai } from '@/ai/genkit';
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

export async function* streamChat(input: MediBotInput): AsyncGenerator<string> {
  // ✅ Directly use async generator — no Promise<AsyncGenerator>
  const validatedInput = MediBotInputSchema.parse(input);

  const messages = [
    { role: 'system', content: mediBotSystemPrompt },
    ...validatedInput.history,
    { role: 'user', content: validatedInput.query },
  ];

  // ✅ Use ai.generateStream properly
  const { stream } = await ai.generateStream({
    model: 'gemini-1.5-flash',
    input: messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n'),
  });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}

const mediBotSystemPrompt = `
You are Sanjiwani Health Assistant...
(rest of your system prompt here)
`;
