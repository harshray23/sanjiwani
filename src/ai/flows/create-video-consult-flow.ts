
'use server';
/**
 * @fileOverview A flow for creating a video consultation.
 * - createVideoConsultation: Creates a meeting link and provides initial advice.
 * - VideoConsultationInput: The input type for the flow.
 * - VideoConsultationOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VideoConsultationInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  doctorName: z.string().describe('The name of the doctor.'),
  doctorSpecialty: z.string().describe("The doctor's specialty."),
});
export type VideoConsultationInput = z.infer<typeof VideoConsultationInputSchema>;

const VideoConsultationOutputSchema = z.object({
  meetingLink: z.string().url().describe('A unique URL for the video consultation session.'),
  preliminaryAdvice: z.string().describe('Initial advice for the patient to prepare for the consultation.'),
});
export type VideoConsultationOutput = z.infer<typeof VideoConsultationOutputSchema>;

export async function createVideoConsultation(input: VideoConsultationInput): Promise<VideoConsultationOutput> {
  return videoConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoConsultationPrompt',
  input: { schema: VideoConsultationInputSchema },
  output: { schema: VideoConsultationOutputSchema },
  prompt: `You are a helpful medical assistant setting up a video consultation.
The patient's name is {{{patientName}}}.
The doctor is {{{doctorName}}}, who is a specialist in {{{doctorSpecialty}}}.

Your tasks:
1.  Generate a unique, secure video meeting link. The link should follow the pattern: https://meet.sanjivanihealth.app/session/{{random_string}}.
2.  Based on the doctor's specialty, provide some brief, general, and safe preliminary advice for the patient. This should be 1-2 sentences. For example, for a cardiologist, you might advise having recent test reports handy. For a general physician, you might suggest noting down all symptoms.

Return the data in the specified JSON format.`,
});

const videoConsultationFlow = ai.defineFlow(
  {
    name: 'videoConsultationFlow',
    inputSchema: VideoConsultationInputSchema,
    outputSchema: VideoConsultationOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'gemini-1.5-flash',
        prompt: prompt.render(input),
        output: { schema: VideoConsultationOutputSchema },
    });

    if (!output) {
      throw new Error('AI model did not return a valid response.');
    }
    // Ensure the generated link is unique and valid. For this mock, we append random chars.
    output.meetingLink = `https://meet.sanjivanihealth.app/session/${Math.random().toString(36).substring(2, 12)}`;
    return output;
  }
);
