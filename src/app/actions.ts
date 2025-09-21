'use server';

import { z } from 'zod';
import { extractSkills } from '@/ai/flows/extract-skills-from-resume-jd';
import { scoreResumeRelevance } from '@/ai/flows/score-resume-relevance';
import { generateActionableFeedback } from '@/ai/flows/generate-actionable-feedback';
import type { JobDescription, AnalysisResult } from '@/lib/types';

const analysisInputSchema = z.object({
  jd: z.object({
    id: z.string(),
    role: z.string(),
    location: z.string(),
    text: z.string(),
  }),
  resumeText: z.string().min(50, 'Resume text cannot be empty.'),
  resumeFilename: z.string(),
});

type ServerActionResult = {
    success: boolean;
    data?: AnalysisResult;
    error?: string;
}

export async function analyzeResumeAction(input: z.infer<typeof analysisInputSchema>): Promise<ServerActionResult> {
  try {
    const validatedInput = analysisInputSchema.parse(input);

    const [jdSkillsData, resumeSkillsData, scoreData] = await Promise.all([
      extractSkills({ text: validatedInput.jd.text }),
      extractSkills({ text: validatedInput.resumeText }),
      scoreResumeRelevance({
        jobDescriptionText: validatedInput.jd.text,
        resumeText: validatedInput.resumeText,
      }),
    ]);

    const jdSkills = new Set(jdSkillsData.skills.map(s => s.toLowerCase()));
    const resumeSkills = new Set(resumeSkillsData.skills.map(s => s.toLowerCase()));
    
    const missingSkills = [...jdSkills].filter(skill => !resumeSkills.has(skill));

    let feedbackData = { suggestions: [] };
    if (missingSkills.length > 0) {
      feedbackData = await generateActionableFeedback({
        jobDescription: validatedInput.jd.text,
        resumeText: validatedInput.resumeText,
        missingSkills: missingSkills,
      });
    }

    const analysisResult: AnalysisResult = {
      id: crypto.randomUUID(),
      ...scoreData,
      jobRole: validatedInput.jd.role,
      location: validatedInput.jd.location,
      resumeFilename: validatedInput.resumeFilename,
      jdSkills: jdSkillsData.skills,
      resumeSkills: Array.from(resumeSkills),
      missingSkills,
      suggestions: feedbackData.suggestions,
      analyzedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: analysisResult,
    };
  } catch (error) {
    console.error('Analysis Error:', error);
    if (error instanceof z.ZodError) {
        return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return {
      success: false,
      error: 'An unexpected error occurred during analysis. The AI model may be overloaded.',
    };
  }
}
