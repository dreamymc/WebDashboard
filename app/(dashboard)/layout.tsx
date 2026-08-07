import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { FilterBar } from "@/components/layout/FilterBar";

// Phase 4: Layout Shell for the Dashboard
// We need to fetch the data here just to pass the `fetchedAt` to TopBar if we wanted,
// but for now, we'll keep it simple and just use the shell.

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const isAdmin = role === "admin";

  return (
    <div className="flex h-screen w-full bg-bg overflow-hidden text-text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar isAdmin={isAdmin} />
        <FilterBar />
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
