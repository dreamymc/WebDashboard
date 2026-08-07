"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

// For this Phase 4 shell, we'll hardcode the unique values based on the §6 rules and test data.
// In a full implementation, these might be extracted dynamically, but static is fine here since
// the dataset is a single frozen snapshot of 262 records.

const PROVINCES = [
  "DAVAO DEL NORTE",
  "DAVAO DEL SUR",
  "DAVAO ORIENTAL",
  "DAVAO DE ORO",
  "COTABATO",
  "SOUTH COTABATO",
  "SULTAN KUDARAT",
  "SARANGANI",
  "AGUSAN DEL NORTE",
  "AGUSAN DEL SUR",
  "SURIGAO DEL NORTE",
  "SURIGAO DEL SUR",
  "MISAMIS ORIENTAL",
  "MISAMIS OCCIDENTAL",
  "LANAO DEL NORTE",
  "BUKIDNON",
  "ZAMBOANGA DEL SUR",
  "ZAMBOANGA DEL NORTE",
  "ZAMBOANGA SIBUGAY"
].sort();

const PROGRAMS = [
  "TowerCo (Macro) - BTS",
  "TowerCo (Macro) - IBS",
  "NTP - BTS",
  "NTP - IBS",
  "LGU - BTS",
];

const VENDORS = ["Ericsson", "Nokia", "HT"];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentProvince = searchParams.get("province") || "";
  const currentProgram = searchParams.get("program") || "";
  const currentVendor = searchParams.get("vendor") || "";

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

  const hasFilters = currentProvince || currentProgram || currentVendor;

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 lg:px-6 bg-bg border-b border-border-color">
      <select
        value={currentProvince}
        onChange={(e) => setFilter("province", e.target.value)}
        className="filter-select"
      >
        <option value="">Province...</option>
        {PROVINCES.map((p) => (
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
        {PROGRAMS.map((p) => (
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
        {VENDORS.map((v) => (
          <option key={v} value={v}>
            {v}
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
