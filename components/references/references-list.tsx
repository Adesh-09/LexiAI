"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { findLegalReferences } from "@/lib/ai-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Search, Link as LinkIcon, ExternalLink, BookOpen } from "lucide-react";

interface ReferencesListProps {
  documentId: string;
  docType?: string | null;
}

interface Reference {
  id?: string;
  document_id: string;
  url: string;
  title: string;
  snippet: string;
  citation: string;
  created_at?: string;
}

export function ReferencesList({ documentId, docType }: ReferencesListProps) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchReferences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("references")
          .select("*")
          .eq("document_id", documentId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReferences(data || []);
      } catch (error) {
        console.error("Error fetching references:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();

    // Subscribe to changes
    const channel = supabase
      .channel("references_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "references", filter: `document_id=eq.${documentId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setReferences((prev) => [payload.new as Reference, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, supabase]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || !supabase || !user) return;
    
    setIsSearching(true);
    
    try {
      // Find references using AI
      const foundReferences = await findLegalReferences(searchTerm);
      
      // Save to database
      for (const ref of foundReferences) {
        const { error } = await supabase.from("references").insert({
          document_id: documentId,
          url: ref.url,
          title: ref.title,
          snippet: ref.snippet,
          citation: ref.citation,
        });
        
        if (error) throw error;
      }
      
      // Log the action
      await supabase.from("logs").insert({
        user_id: user.id,
        action_type: "reference_search",
        doc_id: documentId,
        timestamp: new Date().toISOString(),
      });
      
      toast.success("Found legal references for your search");
      setSearchTerm("");
    } catch (error) {
      console.error("Error finding references:", error);
      toast.error("Failed to find references");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Find Legal References</CardTitle>
          <CardDescription>
            Search for authoritative sources related to this {docType?.toLowerCase() || "document"} or specific legal terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search legal terms or concepts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-[#0ABAB5] hover:bg-[#089996]"
              disabled={!searchTerm.trim() || isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Find References"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-[#0ABAB5]" />
          Saved References
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#0ABAB5]" />
          </div>
        ) : references.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {references.map((ref) => (
              <Card key={ref.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-md font-semibold">{ref.title}</CardTitle>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {ref.snippet}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{ref.url}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {ref.created_at && formatDate(ref.created_at)}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No references yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Search for a legal term above to find relevant references
            </p>
          </div>
        )}
      </div>
    </div>
  );
}