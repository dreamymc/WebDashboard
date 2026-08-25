import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="panel-body p-0 max-h-[400px] overflow-auto">',
    '<div className="panel-body p-0">'
)

content = content.replace(
    '<div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">',
    '<div className="panel-body p-0 flex-1">'
)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
