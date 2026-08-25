import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

# Replace the grid 50:50 wrapper with a 5 columns grid
content = content.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">',
    '<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">'
)

# Replace the left column flex-col wrapper with a col-span-3
content = content.replace(
    '      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">\n        <div className="flex flex-col gap-6">',
    '      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">\n        <div className="lg:col-span-3 flex flex-col gap-6">'
)

# Replace the right column flex-col wrapper with a col-span-2
# Need to find where the right column starts. It's right after the end of the left column (after BuildPlanByMonthTable).
old_right = """            <div className="panel-body p-1 flex-1 flex flex-col justify-center overflow-x-auto">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="panel flex flex-col">
            <div className="panel-header">Early Stage Pipeline</div>"""

new_right = """            <div className="panel-body p-1 flex-1 flex flex-col justify-center overflow-x-auto">
              <BuildPlanByMonthTable data={buildPlanByMonthTable} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="panel flex flex-col">
            <div className="panel-header">Early Stage Pipeline</div>"""

content = content.replace(old_right, new_right)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
