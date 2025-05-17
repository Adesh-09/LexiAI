import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scale, Upload, Bell } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </Button>
        <Button className="bg-[#0ABAB5] hover:bg-[#089996]" size="sm" asChild>
          <Link href="/documents/upload">
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload Document</span>
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}