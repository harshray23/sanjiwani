
'use server';

import { ai } from "@/ai/genkit";
import { z } from "zod";

const MediBotInputSchema = z.object({
  history: z
    .array(z.object({ role: z.string(), content: z.string().optional() }))
    .optional(),
  query: z.string().optional(),
});
export type MediBotInput = z.infer<typeof MediBotInputSchema>;

const mediBotSystemPrompt = `
You are Medi+Bot — a virtual assistant for Sanjiwani Health.
You help users find doctors, hospitals, diagnostic centers, and book appointments.
Be concise, factual, and guide them clearly.
`;

export async function streamChat(input: MediBotInput) {
  // ✅ Sanitize & coerce
  if (!input) throw new Error("Invalid input: empty payload");
  const history = Array.isArray(input.history)
    ? input.history.map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: String(h.content ?? "").trim(),
      }))
    : [];
  const query = String(input.query ?? "").trim();

  const messages = [
    { role: "system", content: mediBotSystemPrompt },
    ...history,
    { role: "user", content: query },
  ];

  // ✅ Always send proper messages shape
  const { stream } = await ai.generateStream({
    model: "gemini-1.5-flash",
    prompt: { messages },
  });

  const reader = stream.getReader();
  async function* iterator() {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value.text ?? "";
      yield value.text ?? "";
    }
  }
  return iterator();
}
