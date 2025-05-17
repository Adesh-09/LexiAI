import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { DocumentTypesChart } from "@/components/dashboard/document-types-chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentTypesChart />
          <RecentActivity />
        </div>
        
        <div className="bg-muted/40 rounded-lg p-6 border border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xl font-medium">Upload a New Document</h3>
          <p className="text-muted-foreground max-w-md">
            Upload legal documents for AI-powered analysis, summarization, and Q&A capabilities
          </p>
          <Button className="bg-[#0ABAB5] hover:bg-[#089996]" asChild>
            <Link href="/documents/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}