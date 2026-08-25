import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Add white-space: nowrap to th
content = content.replace(
    """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--bg);
    border-bottom: 1px solid var(--border-color);
    text-align: left;
    font-variant-numeric: tabular-nums;
  }""",
    """  .data-table th {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--bg);
    border-bottom: 1px solid var(--border-color);
    text-align: left;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }"""
)

# Add white-space: nowrap to td
content = content.replace(
    """  .data-table td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    vertical-align: middle;
  }""",
    """  .data-table td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    vertical-align: middle;
    white-space: nowrap;
  }"""
)

with open('app/globals.css', 'w') as f:
    f.write(content)
