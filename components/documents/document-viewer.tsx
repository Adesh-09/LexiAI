"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { QuestionAnswer } from "@/components/qa/question-answer";
import { ReferencesList } from "@/components/references/references-list";
import { Loader2, Download, FileText, BookOpen, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DocumentViewerProps {
  documentId: string;
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchDocument = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .single();

        if (error) throw error;
        setDocument(data);
      } catch (error) {
        console.error("Error fetching document:", error);
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, supabase]);

  const handleDownloadReport = () => {
    // This would be implemented with a server function to generate 
    // a PDF report with document analysis, Q&A history etc.
    toast.success("Report download started");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0ABAB5]" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Document not found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The document you're looking for may have been deleted or doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <p className="text-sm text-muted-foreground">
            Uploaded on {formatDate(document.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {document.doc_type && (
            <Badge className="bg-[#0ABAB5] hover:bg-[#089996]">
              {document.doc_type}
            </Badge>
          )}
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="summary">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="ask">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask Questions
          </TabsTrigger>
          <TabsTrigger value="references">
            <BookOpen className="h-4 w-4 mr-2" />
            References
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {document.summary || "No summary available for this document."}
                </p>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Key Clauses</h3>
                {document.clause_tags && Object.keys(document.clause_tags).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(document.clause_tags).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="text-sm font-medium capitalize">{key}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{value as string}</p>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No clause analysis available for this document.
                  </p>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ask" className="mt-6">
          <QuestionAnswer documentId={documentId} documentText={document.file_text} />
        </TabsContent>
        
        <TabsContent value="references" className="mt-6">
          <ReferencesList documentId={documentId} docType={document.doc_type} />
        </TabsContent>
      </Tabs>
    </div>
  );
}