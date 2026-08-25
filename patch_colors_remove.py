import re

with open('app/(dashboard)/overview/page.tsx', 'r') as f:
    content = f.read()

# Pipeline Scorecard
# Old: <div className="panel p-4 flex flex-col items-center justify-center min-w-[140px] border-l-4 border-l-brand shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
# New: <div className="panel p-4 flex flex-col items-center justify-center min-w-[140px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
content = content.replace(
    'border-l-4 border-l-brand shadow-sm',
    'shadow-sm'
)

# Pipeline text color
# Old: <div className="text-4xl md:text-5xl font-bold text-brand tabnum tracking-tight">
# New: <div className="text-4xl md:text-5xl font-bold text-text-primary tabnum tracking-tight">
content = content.replace(
    '<div className="text-4xl md:text-5xl font-bold text-brand tabnum tracking-tight">',
    '<div className="text-4xl md:text-5xl font-bold text-text-primary tabnum tracking-tight">'
)

# YTD Scorecard
# Old: <div className="panel p-4 flex flex-col items-center justify-center border-t-4 border-t-warning min-w-[180px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
# New: <div className="panel p-4 flex flex-col items-center justify-center min-w-[180px] shadow-sm ring-1 ring-border-color hover:-translate-y-0.5 hover:shadow-md transition duration-200 ease-out">
content = content.replace(
    'border-t-4 border-t-warning min-w-[180px]',
    'min-w-[180px]'
)

with open('app/(dashboard)/overview/page.tsx', 'w') as f:
    f.write(content)
