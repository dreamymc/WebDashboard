import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

# Change items-start back to items-stretch
content = content.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">'
)

# Put flex-1 back on the table panel
content = content.replace(
    '<div className="panel flex flex-col">\n            <div className="panel-header flex justify-between items-center">\n              <span>Build Plan Summary</span>\n            </div>\n            <div className="panel-body p-1 overflow-x-auto">',
    '<div className="panel flex flex-col flex-1">\n            <div className="panel-header flex justify-between items-center">\n              <span>Build Plan Summary</span>\n            </div>\n            <div className="panel-body p-1 flex-1 flex flex-col justify-center overflow-x-auto">'
)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
