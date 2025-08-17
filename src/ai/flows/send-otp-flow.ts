
'use server';
/**
 * @fileOverview A flow for generating and (simulating) sending an OTP to a user's email.
 *
 * - sendOtp: A function that takes a user's email, generates a 6-digit OTP,
 *   and returns it. In a real application, this flow would also use a service
 *   to send the OTP via email.
 */

import { ai } from '../genkit';
import { z } from 'zod';

// Define the input schema for the send OTP flow.
const SendOtpInputSchema = z.object({
  email: z.string().email().describe("The user's email address to send the OTP to."),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

// Define the output schema for the send OTP flow.
const SendOtpOutputSchema = z.object({
  otp: z.string().describe('The 6-digit one-time password.'),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

/**
 * The main exported function that clients will call.
 * It takes the user's email and returns a generated OTP.
 */
export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

// Define the Genkit flow that orchestrates the OTP generation and sending process.
const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    // 1. Generate a random 6-digit OTP.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Simulate sending the email.
    // In a real application, you would integrate an email service provider here.
    // For example, using Nodemailer, SendGrid, or Mailgun.
    console.log(`
    ================================================
    SIMULATING SENDING EMAIL
    ------------------------------------------------
    To: ${email}
    OTP: ${otp}
    ================================================
    `);

    // 3. Return the generated OTP to the client for verification.
    return { otp };
  }
);
