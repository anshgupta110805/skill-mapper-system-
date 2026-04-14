'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mockDashboardInsights } from '@/lib/mock-data';

const InputSchema = z.object({ profile: z.any() });

export const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Based on this user profile: ${JSON.stringify(input.profile)}
Generate dashboard insights including gravity score metrics, priority actions (low/med/high effort), launch windows (job opportunities with match scores), and risk flags.
Return ONLY valid JSON matching the data schema.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : mockDashboardInsights;
    } catch (e) {
      console.warn("Ollama AI generateDashboardInsightsFlow failed, returning mock.", e);
      return mockDashboardInsights;
    }
  }
);
