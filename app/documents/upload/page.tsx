import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";

export default function DocumentUploadPage() {
  return (
    <DashboardLayout title="Upload Document">
      <div className="flex justify-center">
        <DocumentUploadForm />
      </div>
    </DashboardLayout>
  );
}