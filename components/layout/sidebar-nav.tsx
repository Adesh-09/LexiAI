"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Book, 
  BarChart, 
  UserCog, 
  Scale
} from "lucide-react";
import { useSupabase } from "@/lib/supabase/provider";

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useSupabase();
  
  // Determine if user is admin (simplified check)
  const isAdmin = user?.email === "admin@example.com";
  
  // Define nav items
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText,
    },
    {
      title: "Q&A History",
      href: "/qa-history",
      icon: MessageSquare,
    },
    {
      title: "References",
      href: "/references",
      icon: Book,
    },
  ];
  
  // Admin-only nav items
  const adminItems = [
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: UserCog,
    },
  ];
  
  // Combine nav items based on user role
  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-center space-x-2 px-2 py-4">
        <Scale className="h-6 w-6 text-[#0ABAB5]" />
        <span className="font-bold text-xl">LexiAI</span>
      </div>
      <div className="px-2 py-2">
        {items.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start text-base font-normal mb-1",
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className={cn("mr-2 h-5 w-5")} />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}