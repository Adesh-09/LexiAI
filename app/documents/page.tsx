import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DocumentGrid } from "@/components/documents/document-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function DocumentsPage() {
  return (
    <DashboardLayout title="Documents">
      <div className="flex justify-end mb-6">
        <Button className="bg-[#0ABAB5] hover:bg-[#089996]" asChild>
          <Link href="/documents/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>
      
      <DocumentGrid />
    </DashboardLayout>
  );
}