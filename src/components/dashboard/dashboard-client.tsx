'use client';

import { useState } from 'react';
import type { JobDescription, AnalysisResult } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JdUploadTab from './jd-upload-tab';
import ResumeAnalysisTab from './resume-analysis-tab';
import ResultsTab from './results-tab';
import AnalyticsTab from './analytics-tab';
import { FileText, Search, ClipboardList, BarChart2 } from 'lucide-react';

export default function DashboardClient() {
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState('upload-jd');

  const handleJdUpload = (jd: Omit<JobDescription, 'id'>) => {
    const newJd = { ...jd, id: crypto.randomUUID() };
    setJds((prev) => [newJd, ...prev]);
    setActiveTab('analyze-resume');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setResults((prev) => [result, ...prev]);
    setActiveTab('results');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="upload-jd">
          <FileText className="mr-2" />
          Upload JD
        </TabsTrigger>
        <TabsTrigger value="analyze-resume">
          <Search className="mr-2" />
          Analyze Resume
        </TabsTrigger>
        <TabsTrigger value="results">
          <ClipboardList className="mr-2" />
          Results
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <BarChart2 className="mr-2" />
          Analytics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload-jd">
        <JdUploadTab onJdUpload={handleJdUpload} />
      </TabsContent>
      <TabsContent value="analyze-resume">
        <ResumeAnalysisTab
          jds={jds}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </TabsContent>
      <TabsContent value="results">
        <ResultsTab results={results} />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsTab results={results} />
      </TabsContent>
    </Tabs>
  );
}
