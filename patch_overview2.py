import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

old_bottom = """      {/* Bottom Row: Charts & Table */}
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
            <div className="panel-body p-0 flex-1 overflow-x-auto">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>"""

new_bottom = """      {/* Bottom Row: Charts & Table */}
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
        </div>"""

content = content.replace(old_bottom, new_bottom)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
