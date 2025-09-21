'use client';

import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { useMemo } from 'react';

type AnalyticsTabProps = {
  results: AnalysisResult[];
};

const CHART_CONFIG = {
  count: { label: 'Resumes', color: 'hsl(var(--primary))' },
  high: { label: 'High', color: 'hsl(var(--chart-1))' },
  medium: { label: 'Medium', color: 'hsl(var(--chart-2))' },
  low: { label: 'Low', color: 'hsl(var(--destructive))' },
};

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--destructive))',
];

export default function AnalyticsTab({ results }: AnalyticsTabProps) {
  const scoreDistribution = useMemo(() => {
    const bins = [
      { name: '0-25%', count: 0 },
      { name: '26-50%', count: 0 },
      { name: '51-75%', count: 0 },
      { name: '76-100%', count: 0 },
    ];
    results.forEach((r) => {
      if (r.relevanceScore <= 25) bins[0].count++;
      else if (r.relevanceScore <= 50) bins[1].count++;
      else if (r.relevanceScore <= 75) bins[2].count++;
      else bins[3].count++;
    });
    return bins;
  }, [results]);

  const verdictDistribution = useMemo(() => {
    const verdicts = { High: 0, Medium: 0, Low: 0 };
    results.forEach((r) => {
      if (verdicts[r.verdict as keyof typeof verdicts] !== undefined) {
        verdicts[r.verdict as keyof typeof verdicts]++;
      }
    });
    return [
      { name: 'High', value: verdicts.High, fill: 'var(--color-high)' },
      { name: 'Medium', value: verdicts.Medium, fill: 'var(--color-medium)' },
      { name: 'Low', value: verdicts.Low, fill: 'var(--color-low)' },
    ].filter(item => item.value > 0);
  }, [results]);

  if (results.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Analyze resumes to see insightful charts and data trends here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-12 text-center">
            <h3 className="text-lg font-medium">No Data for Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Results from resume analyses will populate these charts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart />
            Score Distribution
          </CardTitle>
          <CardDescription>
            Distribution of resume relevance scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={CHART_CONFIG}>
            <RechartsBarChart data={scoreDistribution} margin={{ left: -20 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart />
            Verdict Breakdown
          </CardTitle>
          <CardDescription>
            Suitability verdict distribution across all analyses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={CHART_CONFIG}>
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={verdictDistribution} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={2}>
                 {verdictDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </RechartsPieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
