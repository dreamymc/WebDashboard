"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  LineChart, 
  MapPin, 
  Settings, 
  Sun, 
  Moon 
} from "lucide-react";

const LINKS = [
  { href: "/overview", label: "Overview", Icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", Icon: Layers },
  { href: "/vendors-tco", label: "Vendors & TCO", Icon: Users },
  { href: "/forecast", label: "Forecast", Icon: LineChart },
  { href: "/sites", label: "Sites", Icon: MapPin },
];

interface SidebarProps {
  isAdmin: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ isAdmin, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border-color pt-6 pb-6 w-[240px]">
      <div className="px-4 pr-10 mb-8">
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          T7 Dashboard
        </h1>
      </div>

      <nav className="flex flex-col space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          const { Icon } = link;
          return (
            <Link
              key={link.href}
              href={`${link.href}${queryString}`}
              onClick={onNavigate}
              className={`nav-link flex items-center gap-3 ${active ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-border-color" />

        {isAdmin && (
          <Link
            href={`/admin${queryString}`}
            onClick={onNavigate}
            className={`nav-link flex items-center gap-3 ${pathname === "/admin" ? "active" : ""}`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            Admin
          </Link>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="nav-link text-left flex items-center gap-3"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 shrink-0" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 shrink-0" /> Dark Mode
              </>
            )}
          </button>
        )}
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="w-full py-8 flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/t7-logo.png" 
            alt="T7 Logo" 
            className="w-full h-auto opacity-70 hover:opacity-100 transition-opacity duration-200" 
          />
        </div>
      </div>
    </div>
  );
}
