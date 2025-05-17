"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Book, Clock, Loader2 } from "lucide-react";

export function StatsCards() {
  const [stats, setStats] = useState({
    documentsCount: 0,
    questionsCount: 0,
    referencesCount: 0,
    loading: true,
  });
  const { supabase, user } = useSupabase();

  useEffect(() => {
    if (!supabase || !user) return;

    const fetchStats = async () => {
      try {
        // Count documents
        const { count: documentsCount, error: docsError } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (docsError) throw docsError;

        // Count questions
        const { data: docs, error: docsListError } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id);

        if (docsListError) throw docsListError;

        const docIds = docs.map(doc => doc.id);
        
        let questionsCount = 0;
        let referencesCount = 0;
        
        if (docIds.length > 0) {
          // Count questions
          const { count: qaCount, error: qaError } = await supabase
            .from("qa_logs")
            .select("*", { count: "exact", head: true })
            .in("document_id", docIds);
          
          if (qaError) throw qaError;
          questionsCount = qaCount || 0;
          
          // Count references
          const { count: refsCount, error: refsError } = await supabase
            .from("references")
            .select("*", { count: "exact", head: true })
            .in("document_id", docIds);
          
          if (refsError) throw refsError;
          referencesCount = refsCount || 0;
        }

        setStats({
          documentsCount: documentsCount || 0,
          questionsCount,
          referencesCount,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [supabase, user]);

  if (stats.loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#0ABAB5]" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.documentsCount}</div>
          <p className="text-xs text-muted-foreground">
            Legal documents in your workspace
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.questionsCount}</div>
          <p className="text-xs text-muted-foreground">
            AI-answered questions about your documents
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Legal References</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.referencesCount}</div>
          <p className="text-xs text-muted-foreground">
            Authoritative sources and citations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}