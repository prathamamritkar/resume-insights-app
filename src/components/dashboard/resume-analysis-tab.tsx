'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { JobDescription, AnalysisResult } from '@/lib/types';
import { analyzeResumeAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  jdId: z.string().min(1, 'Please select a job description.'),
  resumeText: z.string().min(50, 'Resume text must be at least 50 characters.'),
});

type ResumeAnalysisTabProps = {
  jds: JobDescription[];
  onAnalysisComplete: (result: AnalysisResult) => void;
};

export default function ResumeAnalysisTab({
  jds,
  onAnalysisComplete,
}: ResumeAnalysisTabProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jdId: '',
      resumeText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedJd = jds.find((jd) => jd.id === values.jdId);
    if (!selectedJd) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selected job description not found.',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeAction({
        jd: selectedJd,
        resumeText: values.resumeText,
        resumeFilename: 'pasted-text.txt', // Placeholder as we use textarea
      });

      if (result.success) {
        onAnalysisComplete(result.data as AnalysisResult);
        toast({
          title: 'Analysis Complete',
          description: `Resume scored ${result.data.relevanceScore}% for the ${result.data.jobRole} role.`,
        });
        form.reset({ jdId: values.jdId, resumeText: '' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Analyze Resume
        </CardTitle>
        <CardDescription>
          Select a job and paste a resume to get an AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {jds.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-12 text-center">
            <h3 className="text-lg font-medium">No Job Descriptions Found</h3>
            <p className="text-sm text-muted-foreground">
              Please add a job description from the 'Upload JD' tab first.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jdId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Job Description</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a JD to analyze against..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jds.map((jd) => (
                          <SelectItem key={jd.id} value={jd.id}>
                            {jd.role} - {jd.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full resume text here..."
                        className="min-h-[250px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      For best results, paste the complete, unformatted text from the resume.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
