
'use server';
/**
 * @fileOverview A flow for setting a medicine reminder.
 * - setMedicineReminder: Parses medicine name and sets a reminder.
 * - MedicineReminderInput: The input type for the flow.
 * - MedicineReminderOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MedicineReminderInputSchema = z.object({
  reminderText: z.string().describe('The full text input from the user for the reminder, e.g., "Paracetamol" or "Crocin twice a day".'),
});
export type MedicineReminderInput = z.infer<typeof MedicineReminderInputSchema>;

const MedicineReminderOutputSchema = z.object({
  medicineName: z.string().describe('The parsed name of the medicine.'),
  confirmationMessage: z.string().describe('A confirmation message to show the user, e.g., "Reminder set for Paracetamol."'),
});
export type MedicineReminderOutput = z.infer<typeof MedicineReminderOutputSchema>;

export async function setMedicineReminder(input: MedicineReminderInput): Promise<MedicineReminderOutput> {
  return medicineReminderFlow(input);
}

const medicineReminderFlow = ai.defineFlow(
  {
    name: 'medicineReminderFlow',
    inputSchema: MedicineReminderInputSchema,
    outputSchema: MedicineReminderOutputSchema,
  },
  async (input) => {
    // Correctly structured prompt for Genkit 1.x
    const { output } = await ai.generate({
        model: 'gemini-2.5-flash-preview',
        prompt: `You are an intelligent assistant for a healthcare app. A user wants to set a reminder for their medicine.
The user's input is: "${input.reminderText}"

1.  Parse the primary medicine name from the user's input.
2.  Generate a friendly confirmation message confirming that the reminder has been set for the parsed medicine name.

Example:
- Input: "Paracetamol" -> Output: { medicineName: "Paracetamol", confirmationMessage: "Reminder set for Paracetamol. You will be notified." }
- Input: "Crocin advance 500mg" -> Output: { medicineName: "Crocin advance 500mg", confirmationMessage: "Reminder set for Crocin advance 500mg. You will be notified." }

Return the data in the specified JSON format.`,
        output: { schema: MedicineReminderOutputSchema },
    });

    if (!output) {
      throw new Error('AI model did not return a valid response.');
    }
    return output;
  }
);
