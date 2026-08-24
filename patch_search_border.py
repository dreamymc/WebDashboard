import re

with open('components/StatusSearch.tsx', 'r') as f:
    content = f.read()

old_class = """className="bg-surface border border-border-color text-text-primary text-xs rounded-full pl-9 pr-14 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:border-text-muted/40 w-[180px] sm:w-[220px] md:w-[320px] transition-all"
        />"""

new_class = """className="bg-surface border-2 border-text-muted/30 dark:border-[#404040] text-text-primary text-xs rounded-full pl-9 pr-14 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:border-text-muted/50 w-[180px] sm:w-[220px] md:w-[320px] transition-all"
        />"""

content = content.replace(old_class, new_class)

with open('components/StatusSearch.tsx', 'w') as f:
    f.write(content)
