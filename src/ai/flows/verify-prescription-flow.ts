
'use server';
/**
 * @fileOverview A flow for verifying a doctor's prescription using a multimodal AI model.
 *
 * - verifyPrescription: A function that takes a prescription image and a doctor's name,
 *   and returns whether the prescription is valid.
 * - VerifyPrescriptionInput: The input type for the verification flow.
 * - VerifyPrescriptionOutput: The return type for the verification flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

// Define the input schema for the prescription verification flow.
const VerifyPrescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  doctorName: z.string().describe('The name of the doctor who should be on the prescription.'),
});
export type VerifyPrescriptionInput = z.infer<typeof VerifyPrescriptionInputSchema>;


// Define the output schema for the prescription verification flow.
const VerifyPrescriptionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the prescription is considered valid.'),
  reason: z.string().describe('The reasoning behind the validation decision.'),
});
export type VerifyPrescriptionOutput = z.infer<typeof VerifyPrescriptionOutputSchema>;


/**
 * The main exported function that clients will call.
 * It takes the prescription data and doctor's name, and runs the verification flow.
 */
export async function verifyPrescription(input: VerifyPrescriptionInput): Promise<VerifyPrescriptionOutput> {
  return verifyPrescriptionFlow(input);
}

// Define the Genkit prompt for the AI model.
const verifyPrescriptionPrompt = ai.definePrompt({
  name: 'verifyPrescriptionPrompt',
  input: { schema: VerifyPrescriptionInputSchema },
  output: { schema: VerifyPrescriptionOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an AI assistant responsible for verifying medical prescriptions for a cashback program.
Your task is to analyze the provided image of a prescription and determine if it is valid based on the expected doctor's name.

**Expected Doctor's Name:** {{{doctorName}}}

**Image of Prescription:**
{{media url=photoDataUri}}

**Instructions:**
1.  Read the text from the image.
2.  Check if the document appears to be a real medical prescription.
3.  Find the doctor's name on the prescription.
4.  Compare the name on the prescription with the expected doctor's name. A partial match of the last name is acceptable. The name might be part of a signature or a stamp.
5.  Set 'isValid' to true if the doctor's name is present and the document looks like a prescription. Otherwise, set it to false.
6.  Provide a brief 'reason' for your decision. For example, "Doctor's name 'Dr. Emily Carter' found on the prescription" or "Doctor's name not found".`,
});


// Define the Genkit flow that orchestrates the verification process.
const verifyPrescriptionFlow = ai.defineFlow(
  {
    name: 'verifyPrescriptionFlow',
    inputSchema: VerifyPrescriptionInputSchema,
    outputSchema: VerifyPrescriptionOutputSchema,
  },
  async (input) => {
    // Call the AI prompt with the input data.
    const llmResponse = await verifyPrescriptionPrompt(input);
    const output = llmResponse.output;

    // Handle cases where the model might not return a valid output.
    if (!output) {
      return {
        isValid: false,
        reason: 'AI model did not return a valid response.',
      };
    }

    return output;
  }
);
