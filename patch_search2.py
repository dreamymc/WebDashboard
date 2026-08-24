import re

with open('components/StatusSearch.tsx', 'r') as f:
    content = f.read()

# Add new states
state_addition = """
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);
"""

content = re.sub(r'const \[isOpen, setIsOpen\] = useState\(false\);\n', state_addition, content)

# Update DOM
old_dom = """      <div className="relative flex items-center group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-border-color/20 rounded-l-full border-r border-border-color/30 flex items-center justify-center pointer-events-none z-10 transition-colors group-focus-within:bg-brand/10 group-focus-within:border-brand/30">
          <Search className="w-3.5 h-3.5 text-text-muted group-focus-within:text-brand transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Status search (Serial, PLA...)"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            
            if (val === "" && pathname === "/sites") {
              if (searchParams.has("focus") || searchParams.has("search")) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete("focus");
                newParams.delete("search");
                router.push(`${pathname}?${newParams.toString()}`);
              }
            }
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-surface shadow-sm hover:shadow border border-border-color text-text-primary text-xs rounded-full pl-10 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:shadow-md w-[160px] sm:w-[200px] md:w-[280px] transition-all"
        />
        {query.length > 0 && ("""

new_dom = """      <div className="relative flex items-center group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-transparent rounded-l-full flex items-center justify-center pointer-events-none z-10 transition-colors group-hover:bg-brand/5 group-focus-within:bg-brand/10">
          <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-brand transition-colors group-focus-within:text-brand" />
        </div>
        <input
          type="text"
          placeholder={isFocused ? "Search serial, PLA, or tags..." : "Status search..."}
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            
            if (val === "" && pathname === "/sites") {
              if (searchParams.has("focus") || searchParams.has("search")) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete("focus");
                newParams.delete("search");
                router.push(`${pathname}?${newParams.toString()}`);
              }
            }
          }}
          onFocus={() => { setIsOpen(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          className="bg-surface border border-border-color text-text-primary text-xs rounded-full pl-9 pr-14 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:shadow-[0_0_12px_rgba(56,189,248,0.2)] hover:border-text-muted/40 w-[180px] sm:w-[220px] md:w-[320px] transition-all"
        />
        {!query && !isFocused && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <span className="text-[10px] font-mono font-medium text-text-muted/80 bg-surface-hover border border-border-color px-1.5 py-0.5 rounded shadow-sm">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </span>
          </div>
        )}
        {query.length > 0 && ("""

content = content.replace(old_dom, new_dom)

with open('components/StatusSearch.tsx', 'w') as f:
    f.write(content)
