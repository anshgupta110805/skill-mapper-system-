'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mockCareerPath } from '@/lib/mock-data';

const InputSchema = z.object({
  profile: z.any(),
  targetRole: z.string().optional(),
  city: z.string().optional(),
  prefs: z.any().optional()
});

export const simulateCareerPathFlow = ai.defineFlow(
  {
    name: 'simulateCareerPathFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Simulate 3 career paths (safe, accelerated, bold) for a user aiming for ${input.targetRole} in ${input.city}.
User Profile: ${JSON.stringify(input.profile)}
Prefs: ${JSON.stringify(input.prefs)}
Return ONLY valid JSON with keys "safe", "accelerated", and "bold". Include missing skills, timeline, and salary delta.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : mockCareerPath;
    } catch (e) {
      console.warn("Ollama AI simulateCareerPathFlow failed, returning mock.", e);
      return mockCareerPath;
    }
  }
);
