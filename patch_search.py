import re

with open('components/StatusSearch.tsx', 'r') as f:
    content = f.read()

old_search = """      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Status search (Serial, PLA...)"
          value={query}
          onChange={(e) => {"""

new_search = """      <div className="relative flex items-center group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-border-color/20 rounded-l-full border-r border-border-color/30 flex items-center justify-center pointer-events-none z-10 transition-colors group-focus-within:bg-brand/10 group-focus-within:border-brand/30">
          <Search className="w-3.5 h-3.5 text-text-muted group-focus-within:text-brand transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Status search (Serial, PLA...)"
          value={query}
          onChange={(e) => {"""

content = content.replace(old_search, new_search)

# Update input className to add shadow and adjust padding
old_class = """className="bg-surface-hover border border-border-color text-text-primary text-xs rounded-full pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand w-[160px] sm:w-[200px] md:w-[280px] transition-all"
        />"""

new_class = """className="bg-surface shadow-sm hover:shadow border border-border-color text-text-primary text-xs rounded-full pl-10 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:shadow-md w-[160px] sm:w-[200px] md:w-[280px] transition-all"
        />"""

content = content.replace(old_class, new_class)

with open('components/StatusSearch.tsx', 'w') as f:
    f.write(content)
