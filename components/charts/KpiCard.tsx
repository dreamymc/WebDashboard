import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: ReactNode;
}

export function KpiCard({ label, value, subValue }: KpiCardProps) {
  return (
    <div className="kpi-card flex flex-col justify-center">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {subValue && (
        <div className="mt-2 text-xs text-text-muted">
          {subValue}
        </div>
      )}
    </div>
  );
}
