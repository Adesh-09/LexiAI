"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSupabase } from "@/lib/supabase/provider";
import { useRouter } from "next/navigation";
import { parseDocumentContent } from "@/lib/utils";
import { analyzeDocument } from "@/lib/ai-service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

const uploadSchema = z.object({
  title: z.string().min(3, { message: "Document title is required" }),
  file: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only PDF, DOCX, and TXT files are accepted"
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function DocumentUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { supabase, user } = useSupabase();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  const selectedFile = watch("file");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file);
      // If no title is set yet, use the filename (without extension) as title
      if (!watch("title")) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setValue("title", fileName);
      }
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    if (!supabase || !user) {
      toast.error("You must be logged in to upload documents");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const file = data.file as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      setUploadProgress(30);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      // Get the file's text content
      setUploadProgress(50);
      const fileText = await parseDocumentContent(file);
      
      // Process the document with AI
      setUploadProgress(70);
      const { summary, docType, clauseTags } = await analyzeDocument(fileText);
      
      // Create entry in the documents table
      setUploadProgress(90);
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user.id,
        title: data.title,
        file_url: filePath,
        file_text: fileText,
        summary: summary,
        doc_type: docType,
        clause_tags: clauseTags,
      });
      
      if (dbError) throw dbError;
      
      setUploadProgress(100);
      toast.success("Document uploaded and analyzed successfully");
      
      // Create log
      await supabase.from('logs').insert({
        user_id: user.id,
        action_type: 'document_upload',
        timestamp: new Date().toISOString(),
      });
      
      // Redirect to document viewer
      router.push("/documents");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Document</CardTitle>
          <CardDescription>
            Upload a legal document for AI analysis. Supported formats: PDF, DOCX, TXT.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              placeholder="Enter document title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <div
              className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("file")?.click()}
            >
              <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Drag and drop a file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOCX, TXT up to 10MB
              </p>
              <Input
                id="file"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="mt-2 text-sm font-medium text-[#0ABAB5]">
                  {(selectedFile as File).name}
                </p>
              )}
            </div>
            {errors.file && (
              <p className="text-sm text-destructive">{errors.file.message as string}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#0ABAB5] hover:bg-[#089996]"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress < 100
                  ? `Processing (${uploadProgress}%)...`
                  : "Almost done..."}
              </>
            ) : (
              "Upload & Analyze"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}