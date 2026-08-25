with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="panel-header">Early Stage Pipeline</div>',
    '<div className="panel-header">Pipeline Breakdown</div>'
)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
