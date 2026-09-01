/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import ComboChart from "@/components/charts/ComboChart";
import { FunnelBarChart } from "@/components/charts/FunnelBarChart";
import { BuildPlanByMonthTable } from "@/components/tables/BuildPlanByMonthTable";
import { SimplePieChart } from "@/components/charts/SimplePieChart";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

function CenteredLabel({ text, className = "" }: { text: string, className?: string }) {
  return (
    <div className={`flex w-full justify-center items-center ${className.replace('tracking-tighter', 'tracking-widest')}`}>
      {text}
    </div>
  );
}

export default function OverviewPage() {
  const searchParams = useSearchParams();
  const buildPlan = searchParams.get("buildPlan");
  const { transforms, newBuildPlan, buildPlanByMonthTable } = useData();
  const { kpi, funnelCounts, earlyStagePieChart } = transforms;

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
      {/* Top Section: KPIs, YTD, and Quarterly Plan */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* Left Side: Main KPIs */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Pipeline (standalone) */}
            <div className="panel gold-gradient-bg p-4 flex flex-col items-center justify-center min-w-[140px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out border-none">
              <div className="text-4xl md:text-5xl font-bold tabnum tracking-tight"><NumberReveal value={kpi.totalPipeline} duration={3500} /></div>
              <div className="text-sm font-bold uppercase tracking-widest mt-2">Pipeline</div>
            </div>

            {/* Core Metrics Group */}
            <div className="panel p-0 flex-1 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border-color shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-text-primary tabnum tracking-tight leading-none mb-2"><NumberReveal value={kpi.totalPlan} /></div>
                  <CenteredLabel text="PLAN" className="text-lg font-bold text-text-secondary uppercase tracking-widest" />
                </div>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-text-primary tabnum tracking-tight leading-none mb-2"><NumberReveal value={kpi.trfsCount} /></div>
                  <CenteredLabel text="ACTUAL" className="text-lg font-bold text-text-secondary uppercase tracking-widest" />
                </div>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-brand tabnum tracking-tight leading-none mb-2"><NumberReveal value={kpi.pctTrfs} suffix="%" /></div>
                  <CenteredLabel text="%TRFS" className="text-lg font-bold text-text-secondary uppercase tracking-widest" />
                </div>
              </div>
              {/* 2x2 grid for RTB/RFTI */}
              <div className="grid grid-cols-2 grid-rows-2">
                <div className="p-3 flex flex-col items-center justify-center border-b border-r border-border-color bg-surface-hover/50 transition-colors duration-150 hover:bg-surface-hover">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-brand/10 to-brand/20 border border-brand/40 rounded flex items-center justify-center">
                      <div className="text-lg font-bold text-text-primary tabnum leading-none"><NumberReveal value={kpi.rtbCount} duration={800} /></div>
                    </div>
                    <div className="w-16 mt-1">
                      <CenteredLabel text="RTB" className="text-base font-bold text-text-muted uppercase tracking-tighter" />
                    </div>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center border-b border-border-color bg-surface-hover/50 transition-colors duration-150 hover:bg-surface-hover">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-brand/10 to-brand/20 border border-brand/40 rounded flex items-center justify-center">
                      <div className="text-lg font-bold text-brand tabnum leading-none"><NumberReveal value={kpi.pctRtb} duration={800} suffix="%" /></div>
                    </div>
                    <div className="w-16 mt-1">
                      <CenteredLabel text="%RTB" className="text-base font-bold text-text-muted uppercase tracking-tighter" />
                    </div>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center border-r border-border-color bg-surface-hover/50 transition-colors duration-150 hover:bg-surface-hover">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-brand/10 to-brand/20 border border-brand/40 rounded flex items-center justify-center">
                      <div className="text-lg font-bold text-text-primary tabnum leading-none"><NumberReveal value={kpi.rftiCount} duration={800} /></div>
                    </div>
                    <div className="w-16 mt-1">
                      <CenteredLabel text="RFTI" className="text-base font-bold text-text-muted uppercase tracking-tighter" />
                    </div>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center bg-surface-hover/50 transition-colors duration-150 hover:bg-surface-hover">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-b from-brand/10 to-brand/20 border border-brand/40 rounded flex items-center justify-center">
                      <div className="text-lg font-bold text-brand tabnum leading-none"><NumberReveal value={kpi.pctRfti} duration={800} suffix="%" /></div>
                    </div>
                    <div className="w-16 mt-1">
                      <CenteredLabel text="%RFTI" className="text-base font-bold text-text-muted uppercase tracking-tighter" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: YTD & Quarterly Plan */}
        <div className="flex flex-col md:flex-row gap-4 shrink-0 xl:w-auto">
          {/* YTD Card */}
          <div className="panel p-4 flex flex-col items-center justify-center min-w-[180px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
             <div className="text-sm font-bold text-text-primary mb-3 tracking-widest uppercase">YTD</div>
             <div className="flex w-full justify-center items-end gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary tabnum"><NumberReveal value={kpi.trfsCount} duration={900} /></span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Actual</span>
                </div>
                <div className="w-px h-8 bg-border-color mb-1"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary tabnum"><NumberReveal value={kpi.totalPlan} duration={900} /></span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Plan</span>
                </div>
             </div>
             <div className="text-4xl md:text-5xl font-black text-warning my-1 tabnum tracking-tight"><NumberReveal value={kpi.pctTrfs} suffix="%" /></div>
             <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-3">% TRFS</div>
             <div className="bg-surface-hover rounded-full px-3 py-1 text-xs font-medium text-text-muted flex items-center gap-1.5 border border-border-color">
               <span className="font-bold text-text-primary tabnum"><NumberReveal value={kpi.totalPlan - kpi.trfsCount} duration={800} /></span>
               <span className="uppercase text-[10px] tracking-wider mt-0.5">month gap</span>
             </div>
          </div>

          {/* Quarterly Plan */}
          <div className="panel p-4 flex-1 flex flex-col justify-center min-w-[280px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
             <div className="text-sm font-bold text-text-primary mb-3 tracking-widest uppercase text-center">Quarterly Plan</div>
             <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-3 text-[10px] font-bold text-text-muted uppercase mt-4">
                   <div className="h-7 flex items-center justify-end">Plan</div>
                   <div className="h-7 flex items-center justify-end">Actual</div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-2 md:gap-3 text-center">
                   {[
                     { q: 'Q1', plan: q1Plan, actual: q1Actual },
                     { q: 'Q2', plan: q2Plan, actual: q2Actual },
                     { q: 'Q3', plan: q3Plan, actual: q3Actual },
                     { q: 'Q4', plan: q4Plan, actual: q4Actual }
                   ].map(quarter => (
                     <div key={quarter.q} className="flex flex-col gap-1.5">
                        <div className="text-[11px] font-bold text-text-primary mb-0.5">{quarter.q}</div>
                        <div className="bg-surface-hover border border-border-color rounded h-7 flex items-center justify-center font-bold text-sm tabnum text-text-secondary"><NumberReveal value={quarter.plan} duration={900} /></div>
                        <div className="bg-brand/10 border border-brand/20 text-brand rounded h-7 flex items-center justify-center font-bold text-sm tabnum mt-1.5"><NumberReveal value={quarter.actual} duration={900} /></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="panel flex flex-col">
            <div className="panel-header">Build Plan by Month {buildPlan ? `(${buildPlan})` : ''}</div>
            <div className="panel-body">
              {buildPlan ? (
                <ComboChart
                  data={transforms.buildPlanByMonth}
                  xKey="month"
                  bars={[{ key: "count", name: "Count", color: "var(--brand)" }]}
                  lines={[]}
                  height={300}
                />
              ) : (
                <ComboChart
                  data={newBuildPlan}
                  xKey="month"
                  bars={[{ key: "plan", name: "Plan", color: "var(--brand)" }]}
                  lines={[
                    { key: "actual", name: "Actual", color: "#FFEA00" },
                    { key: "buildOutlook", name: "Build Outlook", color: "#f97316" }
                  ]}
                  height={300}
                />
              )}
            </div>
          </div>
          
          <div className="panel flex flex-col flex-1">
            <div className="panel-header flex justify-between items-center">
              <span>Build Plan Summary</span>
            </div>
            <div className="panel-body p-1 flex-1 flex flex-col justify-center overflow-x-auto">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="panel flex flex-col">
            <div className="panel-header">Pipeline Breakdown</div>
            <div className="panel-body">
              <SimplePieChart data={earlyStagePieChart} height={220} />
            </div>
          </div>

          <div className="panel flex flex-col flex-1">
            <div className="panel-header">Lead Indicator</div>
            <div className="panel-body flex-1 relative min-h-[300px]">
              <div className="absolute inset-x-4 inset-y-4">
                <FunnelBarChart data={funnelCounts.filter(f => f.stage !== 'FOR AWARDING')} height="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
