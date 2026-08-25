import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

# Change items-stretch to items-start
content = content.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">'
)

# Remove flex-1 from the table panel
content = content.replace(
    '<div className="panel flex flex-col flex-1">',
    '<div className="panel flex flex-col">'
)

# Also remove flex-1 from the table's panel-body
content = content.replace(
    '<div className="panel-body p-1 flex-1 overflow-x-auto">',
    '<div className="panel-body p-1 overflow-x-auto">'
)

# And right column lead indicator panel flex-1 shouldn't be needed if it's items-start, but it's harmless.
# Let's reduce the PieChart height slightly to match left column total height closer. 200px instead of 250px.
content = content.replace(
    '<SimplePieChart data={earlyStagePieChart} height={250} />',
    '<SimplePieChart data={earlyStagePieChart} height={220} />'
)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
