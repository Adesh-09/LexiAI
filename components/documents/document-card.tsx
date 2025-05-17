import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, truncateText } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";

interface DocumentCardProps {
  id: string;
  title: string;
  summary: string;
  docType: string;
  createdAt: string;
}

export function DocumentCard({ id, title, summary, docType, createdAt }: DocumentCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
            <CardDescription className="text-xs">
              {formatDate(createdAt)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-[#0ABAB5]/10 text-[#0ABAB5] border-[#0ABAB5]/20">
            {docType || "Document"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-3 w-10 h-10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-[#0ABAB5]" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(summary || "No summary available", 150)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-[#0ABAB5]" asChild>
          <Link href={`/documents/${id}`}>
            <span>View Document</span>
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}