import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DocumentViewer } from "@/components/documents/document-viewer";

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout title="Document Details">
      <DocumentViewer documentId={params.id} />
    </DashboardLayout>
  );
}