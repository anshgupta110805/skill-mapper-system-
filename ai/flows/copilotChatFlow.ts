'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InputSchema = z.object({
  message: z.string(),
  pageContext: z.string(),
  userProfile: z.any()
});

export const copilotChatFlow = ai.defineFlow(
  {
    name: 'copilotChatFlow',
    inputSchema: InputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `You are SkillMapper AI Copilot. 
Context constraint: User is currently viewing page: ${input.pageContext}
User Profile: ${JSON.stringify(input.userProfile)}
User Message: ${input.message}
Respond directly, concisely, and helpfully. Do not output markdown codeblocks unless specifically asked. Do not output JSON.`,
      });
      return text;
    } catch (e) {
      console.warn("Ollama AI copilotChatFlow failed, returning mock fallback response.", e);
      return `I am currently running in local offline mode. This is a simulated response indicating everything is functioning, but I cannot process dynamic requests without the LLM engine turned on. Based on your profile and presence on ${input.pageContext}, you should focus on closing your skill gaps step-by-step!`;
    }
  }
);
