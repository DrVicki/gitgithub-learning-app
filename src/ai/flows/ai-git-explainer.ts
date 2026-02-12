'use server';
/**
 * @fileOverview Provides AI-powered explanations for Git concepts, commands, usage patterns, and troubleshooting.
 *
 * - aiGitExplainer - A function that leverages AI to explain Git topics.
 * - AIGitExplainerInput - The input type for the aiGitExplainer function.
 * - AIGitExplainerOutput - The return type for the aiGitExplainer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIGitExplainerInputSchema = z.object({
  query: z.string().describe('The Git concept, command, common usage pattern, or troubleshooting tip to explain.'),
  context: z
    .string()
    .optional()
    .describe('Optional: The current tutorial step or specific scenario to make the explanation more relevant.'),
});
export type AIGitExplainerInput = z.infer<typeof AIGitExplainerInputSchema>;

const AIGitExplainerOutputSchema = z.object({
  explanation: z.string().describe('A clear, concise, and context-aware explanation of the Git topic.'),
});
export type AIGitExplainerOutput = z.infer<typeof AIGitExplainerOutputSchema>;

export async function aiGitExplainer(input: AIGitExplainerInput): Promise<AIGitExplainerOutput> {
  return aiGitExplainerFlow(input);
}

const aiGitExplainerPrompt = ai.definePrompt({
  name: 'aiGitExplainerPrompt',
  input: { schema: AIGitExplainerInputSchema },
  output: { schema: AIGitExplainerOutputSchema },
  prompt: `You are an expert Git tutor named GitBuddy, dedicated to helping students understand Git and GitHub. Your goal is to provide clear, concise, and context-aware explanations for Git concepts, commands, common usage patterns, and troubleshooting tips.

Please provide an explanation for the following request:

Request: {{{query}}}

{{#if context}}
Current Tutorial Context: {{{context}}}
{{/if}}

Your explanation should be easy to understand for someone learning Git. If a context is provided, make sure the explanation is relevant to that context. Avoid overly technical jargon where possible, but be accurate.`,
});

const aiGitExplainerFlow = ai.defineFlow(
  {
    name: 'aiGitExplainerFlow',
    inputSchema: AIGitExplainerInputSchema,
    outputSchema: AIGitExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await aiGitExplainerPrompt(input);
    return output!;
  }
);
