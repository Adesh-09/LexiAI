"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";

interface DocumentTypeData {
  name: string;
  value: number;
  color: string;
}

export function DocumentTypesChart() {
  const [data, setData] = useState<DocumentTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    if (!supabase || !user) return;

    const fetchDocumentTypes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("doc_type")
          .eq("user_id", user.id);

        if (error) throw error;

        // Count document types
        const typeCounts: Record<string, number> = {};
        data.forEach(doc => {
          const type = doc.doc_type || "Unknown";
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        // Define colors
        const colors = [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))"
        ];

        // Convert to chart data
        const chartData = Object.entries(typeCounts).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching document types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, [supabase, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Types</CardTitle>
        <CardDescription>Breakdown of your document categories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#0ABAB5]" />
          </div>
        ) : data.length > 0 ? (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} documents`, "Count"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem" 
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No documents available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}