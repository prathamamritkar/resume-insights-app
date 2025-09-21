'use client';

import { useState, useMemo } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnalysisResultCard from './analysis-result-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Frown } from 'lucide-react';

type ResultsTabProps = {
  results: AnalysisResult[];
};

export default function ResultsTab({ results }: ResultsTabProps) {
  const [locationFilter, setLocationFilter] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState('');

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const locationMatch = locationFilter
        ? result.location === locationFilter
        : true;
      const scoreMatch = minScoreFilter
        ? result.relevanceScore >= parseInt(minScoreFilter)
        : true;
      return locationMatch && scoreMatch;
    });
  }, [results, locationFilter, minScoreFilter]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(results.map((r) => r.location));
    return Array.from(locations);
  }, [results]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          View and filter all completed resume analyses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col md:flex-row gap-4 rounded-lg border bg-muted/50 p-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter by Location</label>
            <Select onValueChange={setLocationFilter} value={locationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Minimum Score</label>
            <Input
              type="number"
              placeholder="e.g., 70"
              min="0"
              max="100"
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(e.target.value)}
            />
          </div>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-12 text-center">
            <h3 className="text-lg font-medium">No Results Yet</h3>
            <p className="text-sm text-muted-foreground">
              Analyze a resume to see the results here.
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-12 text-center">
            <Frown className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Matching Results</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredResults.map((result) => (
              <AnalysisResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
