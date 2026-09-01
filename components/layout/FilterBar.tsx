"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { ChevronDown } from "lucide-react";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { rawRows } = useData();

  const currentProvince = searchParams.get("province") || "";
  const currentTown = searchParams.get("town") || "";
  const currentLeadIndicator = searchParams.get("leadIndicator") || "";
  const currentBuildPlan = searchParams.get("buildPlan") || "";
  const currentPrio2 = searchParams.get("prio2") || "";

  // Dynamically extract unique values from the raw data
  const provinces = useMemo(() => Array.from(new Set(rawRows.map(r => r.province).filter(Boolean))).sort(), [rawRows]);
  const towns = useMemo(() => Array.from(new Set(rawRows.map(r => r.cityTown).filter(Boolean))).sort(), [rawRows]);
  const leadIndicators = useMemo(() => Array.from(new Set(rawRows.map(r => r.leadIndicator).filter(Boolean))).sort(), [rawRows]);
  const prio2Options = useMemo(() => Array.from(new Set(rawRows.map(r => r.prio2).filter(Boolean))).sort(), [rawRows]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = currentProvince || currentTown || currentLeadIndicator || currentBuildPlan || currentPrio2;

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 lg:px-6 bg-bg border-b border-border-color">
      <div className="relative flex items-center">
      <select
        value={currentProvince}
        onChange={(e) => setFilter("province", e.target.value)}
        className="filter-select"
      >
        <option value="">Province</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-text-muted pointer-events-none" />
    </div>

      <div className="relative flex items-center">
      <select
        value={currentTown}
        onChange={(e) => setFilter("town", e.target.value)}
        className="filter-select"
      >
        <option value="">Town</option>
        {towns.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-text-muted pointer-events-none" />
    </div>

      <div className="relative flex items-center">
      <select
        value={currentLeadIndicator}
        onChange={(e) => setFilter("leadIndicator", e.target.value)}
        className="filter-select"
      >
        <option value="">Lead Indicator</option>
        {leadIndicators.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-text-muted pointer-events-none" />
    </div>

      <div className="relative flex items-center">
      <select
        value={currentBuildPlan}
        onChange={(e) => setFilter("buildPlan", e.target.value)}
        className="filter-select"
      >
        <option value="">Build Plan</option>
        <option value="Q1 BP">Q1 BP</option>
        <option value="Q2 BP">Q2 BP</option>
        <option value="Q3 BP">Q3 BP</option>
        <option value="Q4 BP">Q4 BP</option>
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-text-muted pointer-events-none" />
    </div>

      <div className="relative flex items-center">
      <select
        value={currentPrio2}
        onChange={(e) => setFilter("prio2", e.target.value)}
        className="filter-select"
      >
        <option value="">Priority Tagging</option>
        {prio2Options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-4 h-4 text-text-muted pointer-events-none" />
    </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs font-semibold text-text-secondary hover:text-text-primary uppercase tracking-wider ml-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
