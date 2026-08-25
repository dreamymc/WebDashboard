import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

old_lead = """          <div className="panel flex flex-col">
            <div className="panel-header">Lead Indicator</div>
            <div className="panel-body flex-1">
              <FunnelBarChart data={funnelCounts.filter(f => f.stage !== 'FOR AWARDING')} height={300} />
            </div>
          </div>"""

new_lead = """          <div className="panel flex flex-col flex-1">
            <div className="panel-header">Lead Indicator</div>
            <div className="panel-body flex-1 relative min-h-[300px]">
              <div className="absolute inset-x-4 inset-y-4">
                <FunnelBarChart data={funnelCounts.filter(f => f.stage !== 'FOR AWARDING')} height="100%" />
              </div>
            </div>
          </div>"""

content = content.replace(old_lead, new_lead)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
