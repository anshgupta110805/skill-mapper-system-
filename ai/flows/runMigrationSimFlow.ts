'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mockMigrationResult } from '@/lib/mock-data';

const InputSchema = z.object({
  currentCity: z.string(),
  targetCity: z.string(),
  role: z.string(),
  salary: z.string()
});

export const runMigrationSimFlow = ai.defineFlow(
  {
    name: 'runMigrationSimFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Simulate a career migration from ${input.currentCity} to ${input.targetCity} for role ${input.role} making ${input.salary}.
Provide salary adjustment %, cost of living breakdown, top companies, and target city stats vs current stats.
Return ONLY valid JSON format matching standard schema.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : mockMigrationResult;
    } catch (e) {
      console.warn("Ollama AI runMigrationSimFlow failed, returning mock.", e);
      return mockMigrationResult;
    }
  }
);
