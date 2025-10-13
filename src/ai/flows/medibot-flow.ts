
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

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

// This function will now read from a local file instead of calling an LLM.
export async function* streamChat(input: MediBotInput): AsyncGenerator<string> {
  const validatedInput = MediBotInputSchema.parse(input);
  const userQuery = validatedInput.query.toLowerCase().trim();

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'flow_inputs.jsonl');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      if (line.trim() === '') continue;
      try {
        const entry = JSON.parse(line);
        if (entry.input?.toLowerCase().trim() === userQuery) {
          // Found a match, stream the predefined output
          for (const char of entry.output) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Simulate streaming delay
            yield char;
          }
          return;
        }
      } catch (e) {
        console.error("Skipping malformed line in JSONL:", line);
      }
    }

    // If no match is found, yield a default response.
    const defaultResponse = "I'm sorry, I don't have information about that right now. Please try asking something else.";
    for (const char of defaultResponse) {
        await new Promise(resolve => setTimeout(resolve, 10));
        yield char;
    }

  } catch (error) {
    console.error('Error reading or parsing flow_inputs.jsonl:', error);
    const errorResponse = "I'm having trouble accessing my knowledge base. Please try again later.";
     for (const char of errorResponse) {
        await new Promise(resolve => setTimeout(resolve, 10));
        yield char;
    }
  }
}

// This prompt is no longer used for generation but is kept for context.
const mediBotSystemPrompt = `
You are Sanjiwani Health Assistant. You will now respond based on a predefined set of inputs from a local file.
If a user's query does not match an input, you will provide a default message.
`;
