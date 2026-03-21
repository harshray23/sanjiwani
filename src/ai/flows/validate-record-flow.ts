
'use server';
/**
 * @fileOverview Medical Record Integrity Validation Agent.
 *
 * - validateMedicalRecord - Analyzes a document to ensure it's a valid medical record.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ValidateRecordInputSchema = z.object({
  fileDataUri: z.string().describe("The file as a data URI (PDF or image)."),
});

const ValidateRecordOutputSchema = z.object({
  isMedicalRecord: z.boolean().describe("Whether or not the document is a medical record."),
  reason: z.string().describe("Explanation of why the document was accepted or rejected."),
});

const validatePrompt = ai.definePrompt({
  name: 'validateMedicalRecordPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: ValidateRecordInputSchema },
  output: { schema: ValidateRecordOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  },
  prompt: `You are a medical record auditor for Sanjeevani. 
Analyze the provided document. It may be an image or a PDF.
Your task is to determine if this document is a valid medical proof, such as:
- Lab reports (Blood tests, urine tests, etc.)
- Radiology results (MRI, X-ray, Ultrasound reports)
- Doctor prescriptions
- Hospital discharge summaries
- Vaccination records

Reject documents that are clearly not medical records (e.g., random photos, invoices for non-medical items, generic text documents).

Return a JSON object with 'isMedicalRecord' (boolean) and 'reason' (string).

Document: {{media url=fileDataUri}}`
});

export const validateMedicalRecord = ai.defineFlow(
  {
    name: 'validateMedicalRecordFlow',
    inputSchema: ValidateRecordInputSchema,
    outputSchema: ValidateRecordOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await validatePrompt(input);
      return output || { isMedicalRecord: false, reason: "Could not determine document type." };
    } catch (error: any) {
      console.error("Genkit Flow Error:", error);
      // Fallback for demo environments where AI might not be configured
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('not found')) {
        return { 
          isMedicalRecord: true, 
          reason: "Bypassed validation due to AI service configuration (Demo Mode)." 
        };
      }
      throw error;
    }
  }
);
