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
    try {
      const { output } = await triagePrompt(input);
      return output!;
    } catch (error: any) {
      console.error("AI Triage Flow Error:", error);
      
      // Fallback for Demo Mode if AI service is not configured
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('not found') || error.message?.includes('403')) {
        const symptoms = input.symptoms.toLowerCase();
        
        // Simple keyword-based logic for demo stability
        const isHigh = symptoms.includes('chest pain') || symptoms.includes('bleed') || symptoms.includes('breath') || symptoms.includes('accident');
        
        return {
          severity: isHigh ? 'High' : 'Medium',
          possibleConditions: isHigh ? ['Acute Cardiovascular Event', 'Severe Trauma'] : ['Viral Infection', 'Moderate Fatigue'],
          recommendedResources: {
            icuBed: isHigh,
            bloodGroup: symptoms.includes('bleed') ? 'O-' : undefined,
            specialty: isHigh ? 'Emergency Medicine' : 'General Physician'
          },
          advice: "Demo Mode: Based on your input, we recommend immediate medical attention. Please proceed to the nearest emergency facility."
        };
      }
      throw error;
    }
  }
);
