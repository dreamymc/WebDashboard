import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { FilterBar } from "@/components/layout/FilterBar";
import { DataProvider } from "@/components/DataProvider";
import { fetchSheetRows } from "@/lib/google-sheets";
import { verifySession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = sessionCookie ? await verifySession(sessionCookie) : null;
  const isAdmin = session?.role === "admin";

  const rows = await fetchSheetRows();
  const fetchedAt = new Date().toISOString();

  return (
    <div className="flex h-screen w-full bg-bg overflow-hidden text-text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar isAdmin={isAdmin} fetchedAt={fetchedAt} />
        <FilterBar />
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <DataProvider initialRows={rows}>
            {children}
          </DataProvider>
        </main>
      </div>
    </div>
  );
}
