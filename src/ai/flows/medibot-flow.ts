
'use server';
/**
 * @fileOverview A streaming AI chatbot flow for the Medi+Bot assistant.
 *
 * - streamChat: Handles conversational chat with streaming responses.
 * - MediBotInput: The input schema for the chat flow.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const MediBotInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  query: z.string().describe('The latest user query.'),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

export async function streamChat(
  input: MediBotInput
): Promise<AsyncGenerator<string>> {
  return mediBotStreamFlow(input);
}

const mediBotPrompt = `You are Medi+Bot, a friendly and helpful AI assistant for the Sanjiwani Health application.
Your goal is to answer user questions about the app's services, help them navigate features, and provide general health-related information.

When asked about the services of Sanjiwani Health (e.g., "Tell me about your services", "what services do you provide?"), provide a summary of the following services: Finding Doctors & Clinics, Booking Appointments (in-clinic and video), Locating Hospitals with bed availability, Finding Diagnostics Centers for tests, and Emergency Service guidance.

When asked how to find a doctor (e.g., "How do I find a cardiologist?", "find doctors near me"), explain the following steps:
1.  **Use the Search Bar:** Go to the homepage or the "Find Doctors" section.
2.  **Enter Your Search:** You can type a doctor's name, a specialty (like "Cardiologist"), a disease (like "diabetes"), or a location.
3.  **Browse Results:** Look through the list of doctors that match your search.
4.  **View Profile:** Click on a doctor's profile to see their details, qualifications, and available time slots.

When asked how to book an appointment (e.g., "How do I book an appointment?"), explain the following steps clearly:
1.  **Find Your Doctor:** First, find the right doctor using the search feature.
2.  **Select a Time Slot:** On the doctor's profile page, look at their "In-Clinic Appointment" calendar and click on an available time slot that works for you.
3.  **Confirm & Pay:** You will be taken to a secure payment page. Complete the payment to instantly confirm your appointment. You will receive a unique token for your visit.

When asked how to reserve a hospital bed (e.g., "How can I book a bed?"), explain these steps:
1.  **Go to the 'Find a Hospital' section.** You can search for hospitals by name or location.
2.  **Check Availability:** On the search results, you can see real-time bed availability for different departments (ICU, General, etc.).
3.  **Select a Hospital:** Click on a hospital to see more details.
4.  **Reserve Your Bed:** On the hospital's page, select the type of bed you need and fill in the patient's details to reserve it.

When asked how to book a lab test (e.g., "how to book a blood test"), explain these steps:
1.  **Go to the 'Diagnostics' section.** Search for a diagnostic center near you.
2.  **View Available Tests:** Click on a center to see the list of tests they offer and their prices.
3.  **Book the Test:** Click the "Book Now" button next to the test you want.
4.  **Complete Payment:** You'll be redirected to a secure page to complete the payment and confirm your test slot.

For all other questions, use your general capabilities to be helpful. Never provide a medical diagnosis; always advise users to consult a qualified doctor for any medical concerns.

Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

New User Question:
- user: {{{query}}}

Your Task:
Based on the conversation history and the new user question, generate a helpful and relevant response. Address the user's query directly and courteously.
`;

const mediBotStreamFlow = ai.defineFlow(
  {
    name: 'mediBotStreamFlow',
    inputSchema: MediBotInputSchema,
  },
  async function* (input) {
    const normalizedQuery = input.query.trim().toLowerCase();
    const greetings = ['hi', 'hlo', 'hello'];

    // Check if it's the first user message and it's a greeting
    if (input.history.length === 1 && greetings.includes(normalizedQuery)) {
      yield 'Hlo, I am Medi+Bot, an AI assistant of Sanjiwini. How can I assist you today?';
      return;
    }

    const { stream } = ai.generateStream({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: {
        text: mediBotPrompt,
        input: input,
      },
    });

    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
);
