/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import ComboChart from "@/components/charts/ComboChart";

export default function OverviewPage() {
  const { transforms, newBuildPlan } = useData();
  const { kpi } = transforms;

  return (
    <div className="space-y-6">
      {/* Top Section: KPIs, YTD, and Quarterly Plan */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Main KPIs */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* Pipeline (standalone) */}
            <div className="panel p-6 flex flex-col items-center justify-center min-w-[140px] border-l-4 border-l-brand">
              <div className="text-4xl md:text-5xl font-bold text-brand tabnum tracking-tight">{kpi.totalPlan}</div>
              <div className="text-sm font-bold text-text-primary uppercase tracking-widest mt-2">Pipeline</div>
            </div>

            {/* Core Metrics Group */}
            <div className="panel p-0 flex-1 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border-color">
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-bold text-text-primary tabnum tracking-tight">{kpi.totalPlan}</div>
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">Plan</div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-bold text-text-primary tabnum tracking-tight">{kpi.trfsCount}</div>
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">Actual</div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-bold text-brand tabnum tracking-tight">{kpi.pctTrfs}%</div>
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">% TRFS</div>
              </div>
              {/* 2x2 grid for RTB/RFTI */}
              <div className="grid grid-cols-2 grid-rows-2">
                <div className="p-3 flex flex-col items-center justify-center border-b border-r border-border-color bg-surface-hover/50">
                  <div className="text-lg font-bold text-text-primary tabnum">{kpi.rtbCount}</div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">RTB</div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center border-b border-border-color bg-surface-hover/50">
                  <div className="text-lg font-bold text-brand tabnum">{kpi.pctRtb}%</div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">% RTB</div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center border-r border-border-color bg-surface-hover/50">
                  <div className="text-lg font-bold text-text-primary tabnum">{kpi.rftiCount}</div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">RFTI</div>
                </div>
                <div className="p-3 flex flex-col items-center justify-center bg-surface-hover/50">
                  <div className="text-lg font-bold text-brand tabnum">{kpi.pctRfti}%</div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">% RFTI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: YTD & Quarterly Plan */}
        <div className="flex flex-col md:flex-row gap-6 shrink-0 xl:w-auto">
          {/* YTD Card */}
          <div className="panel p-6 flex flex-col items-center justify-center border-t-4 border-t-warning min-w-[180px]">
             <div className="text-sm font-bold text-text-primary mb-4 tracking-widest uppercase">YTD</div>
             <div className="flex w-full justify-center items-end gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary tabnum">{kpi.trfsCount}</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Actual</span>
                </div>
                <div className="w-px h-8 bg-border-color mb-1"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary tabnum">{kpi.totalPlan}</span>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Plan</span>
                </div>
             </div>
             <div className="text-4xl md:text-5xl font-black text-warning my-2 tabnum tracking-tight">{kpi.pctTrfs}%</div>
             <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-4">% TRFS</div>
             <div className="bg-surface-hover rounded-full px-3 py-1.5 text-xs font-medium text-text-muted flex items-center gap-1.5 border border-border-color">
               <span className="font-bold text-text-primary tabnum">{kpi.totalPlan - kpi.trfsCount}</span>
               <span className="uppercase text-[10px] tracking-wider mt-0.5">month gap</span>
             </div>
          </div>

          {/* Quarterly Plan */}
          <div className="panel p-6 flex-1 flex flex-col justify-center min-w-[280px]">
             <div className="text-sm font-bold text-text-primary mb-6 tracking-widest uppercase text-center">Quarterly Plan</div>
             <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-5 text-[10px] font-bold text-text-muted uppercase mt-5">
                   <div className="h-8 flex items-center justify-end">Plan</div>
                   <div className="h-8 flex items-center justify-end">Actual</div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-2 md:gap-3 text-center">
                   {[
                     { q: 'Q1', plan: kpi.q1Plan, actual: kpi.q1Actual },
                     { q: 'Q2', plan: kpi.q2Plan, actual: kpi.q2Actual },
                     { q: 'Q3', plan: kpi.q3Plan, actual: kpi.q3Actual },
                     { q: 'Q4', plan: kpi.q4Plan, actual: kpi.q4Actual }
                   ].map(quarter => (
                     <div key={quarter.q} className="flex flex-col gap-1.5">
                        <div className="text-[11px] font-bold text-text-primary mb-1">{quarter.q}</div>
                        <div className="bg-surface-hover border border-border-color rounded h-8 flex items-center justify-center font-bold text-sm tabnum text-text-secondary">{quarter.plan}</div>
                        <div className="bg-brand/10 border border-brand/20 text-brand rounded h-8 flex items-center justify-center font-bold text-sm tabnum mt-3.5">{quarter.actual}</div>
                     </div>
                   ))}
                </div>
             </div>
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
