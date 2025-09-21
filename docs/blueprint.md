# **App Name**: Resume Insights

## Core Features:

- Resume Upload and Parsing: Allow users to upload resumes (PDF/DOCX) and parse text, extracting key information using the browser's rendering engine. Since this uses the browser for parsing, no backend database will be required for processing of resumes.
- Job Description Upload: Enable the upload of job descriptions (JD) in PDF or text format. The text parser is not implemented with AI. Store this only temporarily, until analysis is complete. Data will not be persisted.
- Skill Extraction: Uses an AI tool to extract and standardize skills (hard and soft) from both resumes and job descriptions.
- Resume Scoring: An AI tool providing an overall resume score based on how well the candidate fulfills job requirements.
- Resume Analysis Report: Visually present results. Show metrics like keyword matches, skill gaps, and overall suitability.
- Actionable feedback: An AI tool generating actionable suggestions for candidates based on identified gaps. Output must be in short chunks of text.
- Location filtering: Enable filtering for resume by location of applicant.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5), conveying trust, intelligence, and efficiency. Its versatility makes it ideal for creating contrast and a professional aesthetic.
- Background color: Light grayish-blue (#F0F4F9). This provides a clean, uncluttered backdrop that highlights content without causing eye strain.
- Accent color: Soft purple (#9575CD). It adds sophistication and draws attention to key interactive elements.
- Font: 'Inter', a grotesque sans-serif, for a modern, neutral and readable interface.
- Employ a clean, grid-based layout to organize the data, for an intuitive, user-friendly experience. Use white space to avoid clutter and highlight critical insights.
- Use a consistent set of modern icons for key functions (upload, analyze, filter), enhancing usability through visual cues.
- Incorporate subtle transitions (e.g., on data load, filtering) to give a sense of fluidity and responsiveness.