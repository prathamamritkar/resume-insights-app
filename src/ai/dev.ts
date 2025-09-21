import { config } from 'dotenv';
config();

import '@/ai/flows/generate-actionable-feedback.ts';
import '@/ai/flows/extract-skills-from-resume-jd.ts';
import '@/ai/flows/score-resume-relevance.ts';