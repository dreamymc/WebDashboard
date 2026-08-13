/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import ComboChart from "@/components/charts/ComboChart";
import { useEffect, useState } from "react";

function NumberReveal({ value, duration = 1200, suffix = "" }: { value: number, duration?: number, suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // cubic ease-out
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCurrent(Math.floor(easeOut(progress) * value));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{current}{suffix}</>;
}

export default function OverviewPage() {
  const { transforms, newBuildPlan } = useData();
  const { kpi } = transforms;

  // Calculate quarterly deltas from cumulative Sheet2 data
  const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  let lastActual = 0;
  let lastPlan = 0;
  const processedPlan = new Map<string, number>();
  const processedActual = new Map<string, number>();

  for (const m of monthsOrder) {
    const item = newBuildPlan.find(x => x.month === m);
    
    if (item && item.plan !== null && item.plan !== undefined) {
      lastPlan = Math.max(lastPlan, item.plan);
    }
    processedPlan.set(m, lastPlan);

    if (item && item.actual !== null && item.actual !== undefined) {
       lastActual = Math.max(lastActual, item.actual);
    }
    processedActual.set(m, lastActual);
  }

  const q1Plan = processedPlan.get('MAR') || 0;
  const q1Actual = processedActual.get('MAR') || 0;
  const q2Plan = (processedPlan.get('JUN') || 0) - (processedPlan.get('MAR') || 0);
  const q2Actual = (processedActual.get('JUN') || 0) - (processedActual.get('MAR') || 0);
  const q3Plan = (processedPlan.get('SEP') || 0) - (processedPlan.get('JUN') || 0);
  const q3Actual = (processedActual.get('SEP') || 0) - (processedActual.get('JUN') || 0);
  const q4Plan = (processedPlan.get('DEC') || 0) - (processedPlan.get('SEP') || 0);
  const q4Actual = (processedActual.get('DEC') || 0) - (processedActual.get('SEP') || 0);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-4 flex items-center justify-between text-red-400">
        <div className="flex items-center gap-4">
          <div className="text-red-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-red-300">Behind plan by {kpi.totalPlan - kpi.trfsCount} sites</div>
            <div className="text-sm opacity-80">{kpi.trfsCount} of {kpi.totalPlan} TRFS through August. Pace needed to close: {Math.ceil((kpi.totalPlan - kpi.trfsCount) / 4)}/month.</div>
          </div>
        </div>
        <div className="text-sm font-medium">
          Aug pace <span className="font-bold text-red-300">{Math.ceil(kpi.trfsCount / 8)}/mo</span>
        </div>
      </div>

      {/* 4-Up Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium text-text-muted mb-1">TRFS complete</div>
          <div className="text-4xl font-bold text-text-primary tabnum tracking-tight"><NumberReveal value={kpi.trfsCount} /> <span className="text-lg text-text-muted font-normal">/ {kpi.totalPlan}</span></div>
          <div className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
            ↓ {kpi.pctTrfs}% • {Math.round((8/12)*100 - kpi.pctTrfs)}pt below pace
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium text-text-muted mb-1">RTB</div>
          <div className="text-4xl font-bold text-text-primary tabnum tracking-tight"><NumberReveal value={kpi.rtbCount} /> <span className="text-lg text-text-muted font-normal">{kpi.pctRtb}%</span></div>
          <div className="text-xs font-medium text-green-500 flex items-center gap-1 mt-1">
            ↑ +12 vs Jul
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium text-text-muted mb-1">RFTI</div>
          <div className="text-4xl font-bold text-text-primary tabnum tracking-tight"><NumberReveal value={kpi.rftiCount} /> <span className="text-lg text-text-muted font-normal">{kpi.pctRfti}%</span></div>
          <div className="text-xs font-medium text-green-500 flex items-center gap-1 mt-1">
            ↑ +9 vs Jul
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium text-text-muted mb-1">Remaining</div>
          <div className="text-4xl font-bold text-text-primary tabnum tracking-tight"><NumberReveal value={kpi.totalPlan - kpi.trfsCount} /> <span className="text-lg text-text-muted font-normal">sites</span></div>
          <div className="text-xs font-medium text-warning flex items-center gap-1 mt-1">
            4 months left
          </div>
        </div>
      </div>

      {/* Quarterly Attainment Table */}
      <div className="panel p-6 shadow-sm ring-1 ring-border-color">
        <div className="text-lg font-bold text-text-primary mb-6">Quarterly attainment</div>
        <div className="w-full text-sm">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_2fr] gap-4 pb-3 border-b border-border-color text-text-secondary font-medium">
            <div>Quarter</div>
            <div className="text-right">Plan</div>
            <div className="text-right">Actual</div>
            <div className="text-right">Variance</div>
            <div>Attainment</div>
          </div>
          {[
            { label: 'Q1', plan: q1Plan, actual: q1Actual },
            { label: 'Q2', plan: q2Plan, actual: q2Actual },
            { label: 'Q3 to date', plan: q3Plan, actual: q3Actual },
            { label: 'Q4', plan: q4Plan, actual: q4Actual, notStarted: true }
          ].map(q => {
            const variance = q.actual - q.plan;
            const varColor = variance < 0 ? 'text-red-400' : (variance > 0 ? 'text-green-500' : 'text-text-muted');
            const varText = variance > 0 ? `+${variance}` : variance;
            const pct = q.plan > 0 ? Math.min((q.actual / q.plan) * 100, 100) : 0;
            const barColor = variance < 0 ? 'bg-red-500' : 'bg-green-500';
            const bgTrack = variance < 0 ? 'bg-red-950/20' : 'bg-green-950/20';

            return (
              <div key={q.label} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_2fr] gap-4 py-4 border-b border-border-color items-center">
                <div className="font-bold text-text-primary">{q.label}</div>
                <div className="text-right tabnum"><NumberReveal value={q.plan} /></div>
                <div className="text-right tabnum">
                  {q.notStarted ? <span className="text-text-muted">—</span> : <NumberReveal value={q.actual} />}
                </div>
                <div className={`text-right font-medium tabnum ${q.notStarted ? 'text-text-muted' : varColor}`}>
                  {q.notStarted ? 'not started' : varText}
                </div>
                <div className="flex items-center">
                  {!q.notStarted ? (
                    <div className={`w-full h-2 rounded-full overflow-hidden ${bgTrack}`}>
                      <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  ) : (
                    <div className="w-full h-2 rounded-full bg-border-color/30"></div>
                  )}
                </div>
              </div>
            )
          })}
          {/* Total Row */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_2fr] gap-4 pt-4 pb-2 font-bold text-text-primary items-center">
            <div>Total</div>
            <div className="text-right tabnum"><NumberReveal value={q1Plan + q2Plan + q3Plan + q4Plan} /></div>
            <div className="text-right tabnum flex items-center justify-end gap-2 relative">
              <NumberReveal value={q1Actual + q2Actual + q3Actual + q4Actual} />
              <div className="absolute left-[calc(100%+16px)] flex items-center gap-1.5 text-xs text-warning font-normal opacity-90 whitespace-nowrap">
                 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                 Does not tie to {kpi.totalPlan} / {kpi.trfsCount} headline
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Full Width Combo Chart */}
      <div className="panel flex flex-col">
        <div className="panel-header">Build Plan by Month</div>
        <div className="panel-body flex-1">
          <ComboChart
            data={newBuildPlan}
            xKey="month"
            bars={[{ key: "plan", name: "Plan", color: "var(--brand)" }]}
            lines={[
              { key: "actual", name: "Actual", color: "#eab308" }, // yellow
              { key: "buildOutlook", name: "Build Outlook", color: "#f97316" } // orange
            ]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
