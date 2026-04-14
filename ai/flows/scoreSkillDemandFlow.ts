'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mockSkillDemand } from '@/lib/mock-data';

const InputSchema = z.object({
  skill: z.string(),
  city: z.string().optional()
});

export const scoreSkillDemandFlow = ai.defineFlow(
  {
    name: 'scoreSkillDemandFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Score the market demand for the skill "${input.skill}" in ${input.city || 'general market'}. 
Return valid JSON with score (0-100), trend (Rising/Neutral/Decaying), salaryImpact string, and relatedSkills array.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : mockSkillDemand;
    } catch (e) {
      console.warn("Ollama AI scoreSkillDemandFlow failed, returning mock.", e);
      return mockSkillDemand;
    }
  }
);
