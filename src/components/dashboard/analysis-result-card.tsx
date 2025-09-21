'use client';

import type { AnalysisResult } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, Lightbulb, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type AnalysisResultCardProps = {
  result: AnalysisResult;
};

export default function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const getVerdictVariant = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getProgressColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <div>
                <CardTitle className="text-lg">{result.jobRole}</CardTitle>
                <CardDescription>{result.location}</CardDescription>
            </div>
            <Badge variant={getVerdictVariant(result.verdict)}>{result.verdict}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-muted-foreground">Relevance Score</span>
            <span className="text-lg font-bold text-primary">{result.relevanceScore}%</span>
          </div>
          <Progress value={result.relevanceScore} indicatorClassName={getProgressColor(result.relevanceScore)} />
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="skills">
            <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                    <Target />
                    Skill Analysis
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2"><CheckCircle2 className="text-green-500"/>Matching Skills ({result.resumeSkills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {result.resumeSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2"><XCircle className="text-red-500"/>Missing Skills ({result.missingSkills.length})</h4>
                 <div className="flex flex-wrap gap-1">
                  {result.missingSkills.map(skill => <Badge key={skill} variant="destructive">{skill}</Badge>)}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="feedback">
            <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                    <Lightbulb />
                    Actionable Feedback
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {result.suggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                    {result.suggestions.length === 0 && <li>No specific suggestions available.</li>}
                </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Analyzed {formatDistanceToNow(new Date(result.analyzedAt), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}
