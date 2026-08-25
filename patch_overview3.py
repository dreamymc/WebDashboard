import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

# Add PieChart import
content = content.replace(
    'import { BuildPlanByMonthTable } from "@/components/tables/BuildPlanByMonthTable";',
    'import { BuildPlanByMonthTable } from "@/components/tables/BuildPlanByMonthTable";\nimport { SimplePieChart } from "@/components/charts/SimplePieChart";'
)

# Extract earlyStagePieChart from transforms
content = content.replace(
    'const { kpi, funnelCounts } = transforms;',
    'const { kpi, funnelCounts, earlyStagePieChart } = transforms;'
)

old_bottom = """      {/* Bottom Row: Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6 items-stretch">
        <div className="panel flex flex-col">
          <div className="panel-header">Build Plan by Month {buildPlan ? `(${buildPlan})` : ''}</div>
          <div className="panel-body flex flex-col flex-1 p-0">
            <div className="p-4">
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
            <div className="w-full overflow-x-auto border-t border-border-color flex-1">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>

        <div className="panel flex flex-col h-full">
          <div className="panel-header">Lead Indicator</div>
          <div className="panel-body flex-1 relative min-h-[500px]">
            <div className="absolute inset-4">
              <FunnelBarChart data={funnelCounts} height="100%" />
            </div>
          </div>
        </div>
      </div>"""

new_bottom = """      {/* Bottom Row: Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col gap-6">
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
            <div className="panel-body p-1 flex-1 overflow-x-auto">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="panel flex flex-col">
            <div className="panel-header">Early Stage Pipeline</div>
            <div className="panel-body">
              <SimplePieChart data={earlyStagePieChart} height={250} />
            </div>
          </div>

          <div className="panel flex flex-col flex-1">
            <div className="panel-header">Lead Indicator</div>
            <div className="panel-body flex-1">
              <FunnelBarChart data={funnelCounts.filter(f => f.stage !== 'FOR AWARDING')} height={300} />
            </div>
          </div>
        </div>
      </div>"""

content = content.replace(old_bottom, new_bottom)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
