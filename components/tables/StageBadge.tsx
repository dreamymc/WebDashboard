/**
 * StageBadge — the primary cross-cutting visual language of the T7 dashboard.
 * By page 3, users should read stage by color without consulting a legend.
 * Uses hard 1px border (no background fill) to stay lightweight in dense tables.
 */

import { STAGE_COLORS } from "@/lib/normalizers";

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export function StageBadge({ stage, className = "" }: StageBadgeProps) {
  const color = STAGE_COLORS[stage] ?? "var(--text-muted)";
  // Short label: strip the leading "[NN] " prefix for compact display
  const short = stage.replace(/^\[\d+\]\s*/, "");

  return (
    <span
      className={`stage-badge ${className}`}
      style={{ color, borderColor: color }}
      title={stage}
    >
      {short}
    </span>
  );
}

/** Compact variant — shows only the stage code like "[06]" */
export function StageCode({ stage }: { stage: string }) {
  const color = STAGE_COLORS[stage] ?? "var(--text-muted)";
  const short = stage.replace(/^\[\d+\]\s*/, "");

  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        color,
        fontWeight: 700,
        letterSpacing: "0.03em",
      }}
      title={stage}
    >
      {short}
    </span>
  );
}

/** Stage color dot — minimal, for chart legends */
export function StageDot({ stage }: { stage: string }) {
  const color = STAGE_COLORS[stage] ?? "var(--text-muted)";
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
