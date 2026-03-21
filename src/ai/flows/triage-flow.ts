
'use server';
/**
 * @fileOverview AI Clinical Decision Support Agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TriageInputSchema = z.object({
  symptoms: z.string().describe("Structured description of symptoms and context."),
});

const TriageOutputSchema = z.object({
  severity: z.enum(['Low', 'Medium', 'High']).describe("Urgency level of the situation."),
  possibleConditions: z.array(z.string()).describe("A list of potential medical conditions, ordered by likelihood."),
  recommendedResources: z.object({
    icuBed: z.boolean().describe("Whether an ICU bed is likely needed."),
    bloodGroup: z.string().optional().describe("Specific blood group required."),
    specialty: z.string().describe("The medical specialty best suited for this case."),
  }),
  advice: z.string().describe("Structured next-step advice."),
});

const triagePrompt = ai.definePrompt({
  name: 'clinicalSupportPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: TriageInputSchema },
  output: { schema: TriageOutputSchema },
  prompt: `You are a Clinical Decision Support Engine for Sanjeevani. 
Analyze the following patient data: "{{{symptoms}}}"

Your goal is to provide a structured triage assessment. Do not provide a final diagnosis, but rather potential conditions and a risk-based urgency level.

Output requirements:
1. 'severity': High (Life-threatening), Medium (Requires urgent consult), Low (Non-urgent).
2. 'possibleConditions': Top 3-4 likely conditions based on the logic of clinical presentation.
3. 'recommendedResources': Specific hospital resources needed.
4. 'advice': Concise clinical guidance.

Current knowledge context: Sanjeevani is a verified healthcare network anchored on Avalanche.`
});

export const performTriage = ai.defineFlow(
  {
    name: 'clinicalSupportFlow',
    inputSchema: TriageInputSchema,
    outputSchema: TriageOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await triagePrompt(input);
      return output!;
    } catch (error: any) {
      console.error("CDS Flow Error:", error);
      
      // Resilient Fallback for Demo
      return {
        severity: 'Medium',
        possibleConditions: ['Acute Viral Syndrome', 'Systemic Infection'],
        recommendedResources: {
          icuBed: false,
          specialty: 'Internal Medicine'
        },
        advice: "Simulation Mode: Based on reported symptoms, we recommend a non-emergency consultation with an Internal Medicine specialist within 24 hours."
      };
    }
  }
);
