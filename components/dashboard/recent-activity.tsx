"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Loader2, FileUp, MessageSquare, Search, ArrowRight } from "lucide-react";

interface LogEntry {
  id: string;
  user_id: string;
  action_type: string;
  doc_id: string | null;
  timestamp: string;
  document?: {
    title: string;
  };
}

export function RecentActivity() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    if (!supabase || !user) return;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("logs")
          .select(`
            *,
            document:doc_id (
              title
            )
          `)
          .eq("user_id", user.id)
          .order("timestamp", { ascending: false })
          .limit(10);

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [supabase, user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_upload":
        return <FileUp className="h-4 w-4" />;
      case "question_asked":
        return <MessageSquare className="h-4 w-4" />;
      case "reference_search":
        return <Search className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityDescription = (log: LogEntry) => {
    const docTitle = log.document?.title || "a document";
    
    switch (log.action_type) {
      case "document_upload":
        return `Uploaded "${docTitle}"`;
      case "question_asked":
        return `Asked a question about "${docTitle}"`;
      case "reference_search":
        return `Searched for references related to "${docTitle}"`;
      default:
        return "Performed an action";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions in LexiAI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#0ABAB5]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions in LexiAI</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(log.action_type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {getActivityDescription(log)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>
                {log.doc_id && (
                  <Link
                    href={`/documents/${log.doc_id}`}
                    className="text-sm text-[#0ABAB5] hover:underline flex items-center"
                  >
                    View <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}