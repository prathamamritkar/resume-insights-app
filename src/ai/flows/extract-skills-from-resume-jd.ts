'use server';
/**
 * @fileOverview Extracts and standardizes skills from resumes and job descriptions.
 *
 * - extractSkills - A function that extracts skills from text.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsInputSchema = z.object({
  text: z
    .string()
    .describe("The text from which to extract skills, such as a resume or job description."),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z.array(z.string()).describe("A list of standardized skills extracted from the text."),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an expert in extracting skills from text.

  Your task is to identify and standardize both hard and soft skills present in the provided text.

  Text: {{{text}}}

  Output a JSON array containing the extracted skills.
  `,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
