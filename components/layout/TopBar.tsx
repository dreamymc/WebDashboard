"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, LogOut, RefreshCcw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { ShareLinkModal } from "./ShareLinkModal";
import { StatusSearch } from "../StatusSearch";

interface TopBarProps {
  isAdmin: boolean;
  fetchedAt?: string; // ISO string from API
}

export function TopBar({ isAdmin, fetchedAt }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-GB")); // 24h format
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  const title =
    pathname === "/overview" ? "Overview" :
    pathname === "/pipeline" ? "Pipeline" :
    pathname === "/vendors-tco" ? "Vendors & TCO" :
    pathname === "/forecast" ? "Forecast" :
    pathname === "/sites" ? "Sites" :
    pathname === "/admin" ? "Admin" : "";

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Hard refresh to clear client cache and trigger a new fetch
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const timeAgo = () => {
    if (!fetchedAt) return "Unknown";
    const min = Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 60000);
    if (min === 0) return "Just now";
    return `${min} min ago`;
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="h-14 border-b border-border-color bg-surface flex items-center px-4 lg:px-6 justify-between shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="lg:hidden p-1 -ml-1 text-text-secondary hover:text-text-primary">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px] border-border-color">
            <Sidebar isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
        <StatusSearch />

        <div className="hidden sm:flex items-center gap-2 tabnum">
          <span>🕐 {time}</span>
        </div>

        <div className="hidden md:flex items-center gap-4 border-l border-border-color pl-4">
          <span>Refreshed {timeAgo()}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isAdmin && (
          <div className="flex items-center border-l border-border-color pl-4 ml-2">
            <ShareLinkModal />
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 border-l border-border-color pl-4 hover:text-danger transition-colors ml-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
