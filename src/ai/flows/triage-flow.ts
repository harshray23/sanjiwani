'use server';
/**
 * @fileOverview AI Symptom Triage Agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TriageInputSchema = z.object({
  symptoms: z.string().describe("User's description of their current health issues."),
});

const TriageOutputSchema = z.object({
  severity: z.enum(['Low', 'Medium', 'High']).describe("Urgency level of the situation."),
  possibleConditions: z.array(z.string()).describe("A list of potential medical conditions."),
  recommendedResources: z.object({
    icuBed: z.boolean().describe("Whether an ICU bed is likely needed."),
    bloodGroup: z.string().optional().describe("Specific blood group required if hemorrhage or surgery suspected."),
    specialty: z.string().describe("The medical specialty best suited for this case."),
  }),
  advice: z.string().describe("Immediate first-aid or next-step advice."),
});

const triagePrompt = ai.definePrompt({
  name: 'symptomTriagePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: TriageInputSchema },
  output: { schema: TriageOutputSchema },
  prompt: `You are a medical triage assistant for Sanjeevani. 
Analyze the following symptoms: "{{{symptoms}}}"

Your goal is to detect high-risk conditions like heart attack, dengue, trauma, or severe infection.
If symptoms suggest bleeding or severe anemia, specify a required blood group based on the user's input (if mentioned) or leave empty.

Severity Guidelines:
- High: Chest pain, severe bleeding, difficulty breathing, high fever with rash.
- Medium: Persistent moderate pain, sustained high fever, broken bones.
- Low: Common cold, minor cuts, seasonal allergies.

Return JSON with severity, possibleConditions, recommendedResources, and advice.`
});

export const performTriage = ai.defineFlow(
  {
    name: 'performTriageFlow',
    inputSchema: TriageInputSchema,
    outputSchema: TriageOutputSchema,
  },
  async (input) => {
    const { output } = await triagePrompt(input);
    return output!;
  }
);
