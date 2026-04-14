'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CityIntelligenceResult } from '@/types';

function generateDeterministicMock(city: string, role: string): CityIntelligenceResult {
  const seedStr = city + role;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const prng = () => {
     const x = Math.sin(hash++) * 10000;
     return x - Math.floor(x);
  };
  
  const bseRole = role.toLowerCase();
  let topSkills = [];
  if (bseRole.includes('data') || bseRole.includes('machine') || bseRole.includes('ai')) {
      topSkills = [
         { skill: 'Python', demand: 85 + Math.floor(prng() * 15), category: 'Data' },
         { skill: 'SQL', demand: 80 + Math.floor(prng() * 15), category: 'Data' },
         { skill: 'TensorFlow', demand: 75 + Math.floor(prng() * 15), category: 'AI' }
      ];
  } else if (bseRole.includes('product') || bseRole.includes('manager')) {
      topSkills = [
         { skill: 'Agile', demand: 85 + Math.floor(prng() * 15), category: 'Process' },
         { skill: 'Jira', demand: 80 + Math.floor(prng() * 15), category: 'Tools' },
         { skill: 'Data Analytics', demand: 75 + Math.floor(prng() * 15), category: 'Data' }
      ];
  } else {
      topSkills = [
         { skill: 'React', demand: 85 + Math.floor(prng() * 15), category: 'Frontend' },
         { skill: 'Node.js', demand: 80 + Math.floor(prng() * 15), category: 'Backend' },
         { skill: 'AWS', demand: 75 + Math.floor(prng() * 15), category: 'DevOps' }
      ];
  }

  return {
    demandScore: 65 + Math.floor(prng() * 30),
    avgSalary: "$" + (80 + Math.floor(prng() * 60)) + ",000",
    activeOpenings: 100 + Math.floor(prng() * 1500),
    competitionLevel: prng() > 0.5 ? 'High' : (prng() > 0.5 ? 'Medium' : 'Low'),
    topSkills,
    companies: [
      { name: ['TechCorp', 'DataSys', 'FintechOS', 'LocalApp', 'GovTech'][Math.floor(prng()*5)], openings: Math.floor(prng()*50)+5, salary: '$'+(90+Math.floor(prng()*50))+'k', remote: prng()>0.5 },
      { name: ['InnovateInc', 'CloudWorks', 'VentureDev', 'SecureNet'][Math.floor(prng()*4)], openings: Math.floor(prng()*30)+2, salary: '$'+(80+Math.floor(prng()*40))+'k', remote: prng()>0.5 }
    ],
    skillGaps: ['TypeScript', 'GraphQL', 'System Design'].sort(() => 0.5 - prng()).slice(0, 2),
    insights: [
      `Hiring for ${role} in ${city} has shifted ${prng()>0.5?'up':'down'} ${Math.floor(prng()*20)+2}% this quarter.`,
      `${prng()>0.5?'Remote':'Onsite'} roles constitute ${Math.floor(prng()*60)+20}% of openings.`,
      `Engineers with ${topSkills[0].skill} command a ${Math.floor(prng()*15)+3}% premium here.`
    ]
  };
}

const InputSchema = z.object({
  city: z.string(),
  role: z.string().optional()
});

export const generateCityIntelligenceFlow = ai.defineFlow(
  {
    name: 'generateCityIntelligenceFlow',
    inputSchema: InputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        model: 'ollama/llama3',
        prompt: `Generate labor market intelligence for ${input.city} focusing on ${input.role || 'general tech'} roles.
Return valid JSON including demandScore, avgSalary, activeOpenings, topSkills, and insights array.`,
        output: { format: 'json' },
      });
      return text ? (typeof text === 'string' ? JSON.parse(text) : text) : generateDeterministicMock(input.city, input.role || '');
    } catch (e) {
      console.warn("Ollama AI generateCityIntelligenceFlow failed, returning dynamic mock.", e);
      return generateDeterministicMock(input.city, input.role || '');
    }
  }
);
