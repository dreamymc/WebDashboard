"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/overview", label: "Overview" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/vendors-tco", label: "Vendors & TCO" },
  { href: "/forecast", label: "Forecast" },
  { href: "/sites", label: "Sites" },
];

interface SidebarProps {
  isAdmin: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ isAdmin, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border-color pt-6 pb-6 w-[240px]">
      <div className="px-4 mb-8">
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          T7 Dashboard
        </h1>
      </div>

      <nav className="flex flex-col space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`nav-link ${active ? "active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-border-color" />

        {isAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
          >
            Admin
          </Link>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="nav-link text-left"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        )}
      </nav>

      <div className="flex-1 flex justify-center items-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/t7-logo.png" 
          alt="T7 Logo" 
          className="w-32 opacity-70 hover:opacity-100 transition-opacity duration-200" 
        />
      </div>
    </div>
  );
}
