"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useData } from "@/components/DataProvider";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { rawRows } = useData();

  const currentProvince = searchParams.get("province") || "";
  const currentProgram = searchParams.get("program") || "";
  const currentVendor = searchParams.get("vendor") || "";
  const currentPrio1 = searchParams.get("prio1") || "";
  const currentPrio2 = searchParams.get("prio2") || "";

  // Dynamically extract unique values from the raw data
  const provinces = useMemo(() => Array.from(new Set(rawRows.map(r => r.province).filter(Boolean))).sort(), [rawRows]);
  const programs = useMemo(() => Array.from(new Set(rawRows.map(r => r.program).filter(Boolean))).sort(), [rawRows]);
  const vendors = useMemo(() => Array.from(new Set(rawRows.map(r => r.vendor).filter(Boolean))).sort(), [rawRows]);
  const prio1Options = useMemo(() => Array.from(new Set(rawRows.map(r => r.prio1).filter(Boolean))).sort(), [rawRows]);
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

  const hasFilters = currentProvince || currentProgram || currentVendor || currentPrio1 || currentPrio2;

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 lg:px-6 bg-bg border-b border-border-color">
      <select
        value={currentProvince}
        onChange={(e) => setFilter("province", e.target.value)}
        className="filter-select"
      >
        <option value="">Province...</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={currentProgram}
        onChange={(e) => setFilter("program", e.target.value)}
        className="filter-select"
      >
        <option value="">Program...</option>
        {programs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={currentVendor}
        onChange={(e) => setFilter("vendor", e.target.value)}
        className="filter-select"
      >
        <option value="">Vendor (Network)...</option>
        {vendors.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <select
        value={currentPrio1}
        onChange={(e) => setFilter("prio1", e.target.value)}
        className="filter-select"
      >
        <option value="">Prio 1...</option>
        {prio1Options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={currentPrio2}
        onChange={(e) => setFilter("prio2", e.target.value)}
        className="filter-select"
      >
        <option value="">Prio 2...</option>
        {prio2Options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

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
