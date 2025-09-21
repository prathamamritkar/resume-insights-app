export type JobDescription = {
  id: string;
  role: string;
  location: string;
  text: string;
};

export type AnalysisResult = {
  id: string;
  relevanceScore: number;
  hardMatchScore: number;
  semanticMatchScore: number;
  verdict: string;
  jobRole: string;
  location: string;
  resumeFilename: string;
  jdSkills: string[];
  resumeSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  analyzedAt: string;
};
