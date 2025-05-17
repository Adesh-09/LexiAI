"use client";

import { useState, useEffect, useRef } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { askQuestionAboutDocument } from "@/lib/ai-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, MessageSquare, Send, User, Bot } from "lucide-react";

interface QuestionAnswerProps {
  documentId: string;
  documentText: string;
}

interface QAItem {
  id?: string;
  document_id: string;
  question: string;
  answer: string;
  created_at?: string;
  isLoading?: boolean;
}

export function QuestionAnswer({ documentId, documentText }: QuestionAnswerProps) {
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { supabase, user } = useSupabase();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;

    const fetchQAHistory = async () => {
      setHistoryLoading(true);
      try {
        const { data, error } = await supabase
          .from("qa_logs")
          .select("*")
          .eq("document_id", documentId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setQaHistory(data || []);
      } catch (error) {
        console.error("Error fetching QA history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchQAHistory();

    // Subscribe to changes
    const channel = supabase
      .channel("qa_logs_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "qa_logs", filter: `document_id=eq.${documentId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQaHistory((prev) => [...prev, payload.new as QAItem]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, supabase]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaHistory]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !supabase || !user) return;

    const newQuestion = question;
    setQuestion("");
    
    // Add temporary item to show loading state
    const tempItem: QAItem = {
      document_id: documentId,
      question: newQuestion,
      answer: "",
      isLoading: true,
    };
    
    setQaHistory((prev) => [...prev, tempItem]);
    setLoading(true);

    try {
      // Get AI answer
      const answer = await askQuestionAboutDocument(documentText, newQuestion);
      
      // Save to database
      const { error, data } = await supabase.from("qa_logs").insert({
        document_id: documentId,
        question: newQuestion,
        answer: answer,
      }).select();

      if (error) throw error;
      
      // Update temporary item with real data
      setQaHistory((prev) => 
        prev.map((item, index) => 
          index === prev.length - 1 ? data[0] : item
        )
      );
      
      // Log the interaction
      await supabase.from("logs").insert({
        user_id: user.id,
        action_type: "question_asked",
        doc_id: documentId,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error("Error in QA process:", error);
      toast.error("Failed to process your question");
      
      // Remove the temporary item if there was an error
      setQaHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 text-[#0ABAB5] mr-2" />
          <h3 className="text-lg font-semibold">Ask Questions About This Document</h3>
        </div>
        
        <div className="h-[400px] overflow-y-auto mb-4 pr-2">
          {historyLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-[#0ABAB5]" />
            </div>
          ) : qaHistory.length > 0 ? (
            <div className="space-y-6">
              {qaHistory.map((item, index) => (
                <div key={item.id || index} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary flex items-center justify-center h-8 w-8">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="px-4 py-3 rounded-lg bg-muted inline-block">
                        <p className="text-sm">{item.question}</p>
                      </div>
                      {item.created_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#0ABAB5] flex items-center justify-center h-8 w-8">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {item.isLoading ? (
                        <div className="px-4 py-3 rounded-lg bg-card border inline-block min-w-[100px]">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-lg bg-card border">
                          <p className="text-sm whitespace-pre-line">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < qaHistory.length - 1 && <Separator />}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No questions asked yet. Ask your first question about this document.
              </p>
            </div>
          )}
        </div>
        
        <CardContent className="p-0">
          <form onSubmit={handleQuestionSubmit} className="flex gap-2">
            <Textarea
              placeholder="Ask a question about this document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="resize-none"
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="bg-[#0ABAB5] hover:bg-[#089996]"
              disabled={!question.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}