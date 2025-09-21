import Header from '@/components/layout/header';
import DashboardClient from '@/components/dashboard/dashboard-client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <DashboardClient />
      </main>
    </div>
  );
}
