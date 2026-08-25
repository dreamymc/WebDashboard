import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# 1. Add --header-bg to :root
content = content.replace(
    '  --surface-hover: #f9f9f9;',
    '  --surface-hover: #f9f9f9;\n  --header-bg: #e2e8f0;'
)

# 2. Add --header-bg to .dark
content = content.replace(
    '  --surface-hover: #212121;',
    '  --surface-hover: #212121;\n  --header-bg: #27272a;'
)

# 3. Update .panel-header to add background (keep text-secondary)
old_panel = """  .panel-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}"""
new_panel = """  .panel-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--header-bg);
}"""
content = content.replace(old_panel, new_panel)

# 4. Update .data-table th to use header-bg (keep text-secondary)
old_th = """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--surface-hover);"""
new_th = """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--header-bg);"""
content = content.replace(old_th, new_th)

with open('app/globals.css', 'w') as f:
    f.write(content)
