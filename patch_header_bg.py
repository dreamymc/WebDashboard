import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Add --header-bg to :root
content = content.replace(
    '  --surface-hover: #f9f9f9;',
    '  --surface-hover: #f9f9f9;\n  --header-bg: #e2e8f0;'
)

# Add --header-bg to .dark
content = content.replace(
    '  --surface-hover: #212121;',
    '  --surface-hover: #212121;\n  --header-bg: #27272a;'
)

# Update .panel-header
old_panel = """  .panel-header {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
  }"""
new_panel = """  .panel-header {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    background: var(--header-bg);
  }"""
content = content.replace(old_panel, new_panel)

# Update .data-table th
old_th = """    letter-spacing: 0.06em;
    background: var(--surface-hover);
    border-bottom: 1px solid var(--border-color);"""
new_th = """    letter-spacing: 0.06em;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);"""
content = content.replace(old_th, new_th)

with open('app/globals.css', 'w') as f:
    f.write(content)
