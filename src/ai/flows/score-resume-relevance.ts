'use server';

/**
 * @fileOverview This file contains the Genkit flow for scoring resume relevance against a job description.
 *
 * It exports:
 * - `scoreResumeRelevance`: The main function to call for scoring a resume.
 * - `ScoreResumeRelevanceInput`: The input type for the `scoreResumeRelevance` function.
 * - `ScoreResumeRelevanceOutput`: The output type for the `scoreResumeRelevance` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreResumeRelevanceInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescriptionText: z
    .string()
    .describe('The text content of the job description.'),
});
export type ScoreResumeRelevanceInput = z.infer<typeof ScoreResumeRelevanceInputSchema>;

const ScoreResumeRelevanceOutputSchema = z.object({
  relevanceScore: z
    .number()
    .describe(
      'A numerical score (0-100) indicating the relevance of the resume to the job description.'
    ),
  hardMatchScore: z
    .number()
    .describe(
      'A numerical score (0-100) indicating the hard skill relevance of the resume to the job description.'
    ),
  semanticMatchScore: z
    .number()
    .describe(
      'A numerical score (0-100) indicating the semantic relevance of the resume to the job description.'
    ),
  verdict: z
    .string()
    .describe(
      'Verdict if the resume has High, Medium, or Low suitability for the job.'
    ),
});
export type ScoreResumeRelevanceOutput = z.infer<typeof ScoreResumeRelevanceOutputSchema>;

export async function scoreResumeRelevance(
  input: ScoreResumeRelevanceInput
): Promise<ScoreResumeRelevanceOutput> {
  return scoreResumeRelevanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreResumeRelevancePrompt',
  input: {schema: ScoreResumeRelevanceInputSchema},
  output: {schema: ScoreResumeRelevanceOutputSchema},
  prompt: `You are an expert in resume screening and candidate evaluation.

  You are provided a resume and a job description.  You will provide a score (0-100) as to how well the resume matches the job description, along with a verdict of High, Medium, or Low, and the reasoning.

  Here is the resume:
  {{resumeText}}

  Here is the job description:
  {{jobDescriptionText}}

  Respond in a JSON format.
`,
});

const scoreResumeRelevanceFlow = ai.defineFlow(
  {
    name: 'scoreResumeRelevanceFlow',
    inputSchema: ScoreResumeRelevanceInputSchema,
    outputSchema: ScoreResumeRelevanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
