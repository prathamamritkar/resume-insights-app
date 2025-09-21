// use server'
'use server';

/**
 * @fileOverview Generates actionable feedback for candidates based on skill gaps.
 *
 * - generateActionableFeedback - A function that generates feedback for candidates.
 * - GenerateActionableFeedbackInput - The input type for the generateActionableFeedback function.
 * - GenerateActionableFeedbackOutput - The return type for the generateActionableFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionableFeedbackInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The text of the job description.'),
  resumeText: z.string().describe('The text of the resume.'),
  missingSkills: z.array(z.string()).describe('An array of missing skills for the candidate.'),
});
export type GenerateActionableFeedbackInput = z.infer<typeof GenerateActionableFeedbackInputSchema>;

const GenerateActionableFeedbackOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Actionable suggestions for the candidate to improve their profile.'),
});
export type GenerateActionableFeedbackOutput = z.infer<typeof GenerateActionableFeedbackOutputSchema>;

export async function generateActionableFeedback(
  input: GenerateActionableFeedbackInput
): Promise<GenerateActionableFeedbackOutput> {
  return generateActionableFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionableFeedbackPrompt',
  input: {schema: GenerateActionableFeedbackInputSchema},
  output: {schema: GenerateActionableFeedbackOutputSchema},
  prompt: `You are a career coach providing feedback to job candidates.

  Based on the job description and the candidate's resume, identify areas where the candidate can improve.
  Provide actionable suggestions in short, digestible chunks of text.

  Job Description: {{{jobDescription}}}
  Resume Text: {{{resumeText}}}
  Missing Skills: {{#each missingSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Format the output as a JSON array of strings.
  `,
});

const generateActionableFeedbackFlow = ai.defineFlow(
  {
    name: 'generateActionableFeedbackFlow',
    inputSchema: GenerateActionableFeedbackInputSchema,
    outputSchema: GenerateActionableFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
