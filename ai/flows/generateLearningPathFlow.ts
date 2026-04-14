'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mockLearningPath } from '@/lib/mock-data';

const InputSchema = z.object({
  skillGaps: z.array(z.string()),
  targetRole: z.string(),
  weeks: z.number().default(8)
});

export const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Create a ${input.weeks}-week learning path for ${input.targetRole} focusing on bridging these skill gaps: ${input.skillGaps.join(', ')}.
Return ONLY valid JSON containing an array of weeklyPlans with resources.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : mockLearningPath;
    } catch (e) {
      console.warn("Ollama AI generateLearningPathFlow failed, returning mock.", e);
      return mockLearningPath;
    }
  }
);
