import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ReferencesPage() {
  return (
    <DashboardLayout title="References">
      <div className="bg-muted/40 rounded-lg p-8 border border-dashed flex flex-col items-center justify-center text-center space-y-4">
        <h3 className="text-xl font-medium">Legal References</h3>
        <p className="text-muted-foreground max-w-md">
          View all legal references you've saved across documents.
          This page is currently under development.
        </p>
      </div>
    </DashboardLayout>
  );
}