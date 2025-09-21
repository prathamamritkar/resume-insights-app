import { Briefcase } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto flex items-center gap-4 p-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Resume Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Resume Analysis for a Smarter Hiring Process
          </p>
        </div>
      </div>
    </header>
  );
}
