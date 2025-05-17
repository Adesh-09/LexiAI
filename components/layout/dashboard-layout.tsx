import { SidebarNav } from "@/components/layout/sidebar-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <SidebarNav />
      </aside>
      <main className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <DashboardHeader title={title} />
          {children}
        </div>
      </main>
    </div>
  );
}