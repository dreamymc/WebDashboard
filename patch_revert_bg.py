import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# 1. Remove --header-bg
content = re.sub(r'\s*--header-bg:\s*#[a-fA-F0-9]+;', '', content)

# 2. Revert .panel-header background & change text color
old_panel = """  .panel-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--header-bg);
}"""
new_panel = """  .panel-header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}"""
content = content.replace(old_panel, new_panel)

# 3. Revert .data-table th background & change text color
old_th = """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--header-bg);"""
new_th = """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--surface-hover);"""
content = content.replace(old_th, new_th)

with open('app/globals.css', 'w') as f:
    f.write(content)
