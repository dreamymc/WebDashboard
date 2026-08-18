"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useData } from "@/components/DataProvider";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar } from "lucide-react";
import { StageCode } from "@/components/tables/StageBadge";

export function StatusSearch() {
  const { rawRows } = useData();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear the search input if the filter is removed from the URL
  useEffect(() => {
    if (!searchParams.has("focus") && !searchParams.has("search")) {
      setQuery("");
    }
  }, [searchParams]);

  const results = query.length >= 2 
    ? rawRows.filter(r => {
        const q = query.toLowerCase();
        return (
          (r.serialNumber || "").toLowerCase().includes(q) ||
          (r.plaId || "").toLowerCase().includes(q) ||
          (r.srName || "").toLowerCase().includes(q) ||
          (r.bcfName || "").toLowerCase().includes(q)
        );
      }).slice(0, 10) // Limit to top 10 results
    : [];

  return (
    <div ref={containerRef} className="relative flex items-center ml-2">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Status search (Serial, PLA...)"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            
            if (val === "" && pathname === "/sites") {
              if (searchParams.has("focus") || searchParams.has("search")) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete("focus");
                newParams.delete("search");
                router.push(`${pathname}?${newParams.toString()}`);
              }
            }
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-surface-hover border border-border-color text-text-primary text-xs rounded-full pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand w-[160px] sm:w-[200px] md:w-[280px] transition-all"
        />
        {query.length > 0 && (
          <button 
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              if (pathname === "/sites" && (searchParams.has("focus") || searchParams.has("search"))) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete("focus");
                newParams.delete("search");
                router.push(`${pathname}?${newParams.toString()}`);
              }
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary bg-transparent border-none p-1 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="fixed md:absolute top-14 md:top-full left-2 right-2 md:left-auto md:right-0 mt-2 md:w-[420px] bg-surface border border-border-color shadow-lg rounded-md overflow-hidden z-[100]">
          <div className="p-2 border-b border-border-color bg-surface-hover text-xs font-semibold text-text-secondary">
            Search Results ({results.length}{results.length === 10 ? "+" : ""})
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-muted">No sites found.</div>
            ) : (
              results.map((r, i) => (
                <div key={i} className="p-3 border-b border-border-color last:border-0 hover:bg-surface-hover transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0 pr-4">
                      <Link 
                        href={`/sites?search=${r.serialNumber}#site-details`}
                        onClick={() => setIsOpen(false)}
                        className="font-mono text-sm font-bold text-text-primary truncate hover:text-brand hover:underline transition-all cursor-pointer inline-block"
                      >
                        {r.serialNumber}
                      </Link>
                      <div className="text-[10px] text-text-muted mt-0.5 truncate">
                        {r.plaId && <span className="mr-2">PLA: {r.plaId}</span>}
                        {r.srName && <span>SR: {r.srName}</span>}
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        {r.bcfName}
                      </div>
                      <div className="text-[10px] font-medium mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-brand">Net: {r.vendor}</span>
                        <span className="text-warning">TCO: {r.tcoBauVendor || "None"}</span>
                        <span className="text-info border-l border-border-color pl-2">Prog: {r.program || "None"}</span>
                      </div>
                      {r.plannedTech && (
                        <div className="text-[10px] text-text-muted mt-0.5 truncate">
                          Tech: {r.plannedTech}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <StageCode stage={r.leadIndicator} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-color/50">
                    <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-medium text-[10px] uppercase text-text-muted">Forecasts</div>
                        <div className="truncate">B&D: <span className="text-text-primary font-medium">{r.bndTrfsForecast || "None"}</span></div>
                        <div className="truncate">Cons: <span className="text-text-primary font-medium">{r.conservativeFC || "None"}</span></div>
                      </div>
                    </div>
                    <Link 
                      href={`/sites?focus=${r.serialNumber}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-1.5 text-xs text-text-secondary hover:bg-surface-hover rounded p-1 -m-1 transition-colors group cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0">
                        <div className="font-medium text-[10px] uppercase text-text-muted group-hover:text-text-primary transition-colors">Location & Map ↗</div>
                        <div className="truncate">{r.province || "Unknown"}</div>
                        <div className="truncate">{r.cityTown || "Unknown"}</div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
