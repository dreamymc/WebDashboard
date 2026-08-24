import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Update dark mode variables
old_vars = """  --bg:            #0a0a0a;
  --surface:       #111111;
  --surface-hover: #1a1a1a;
  --border-color:  #262626;"""

new_vars = """  --bg:            #050505;
  --surface:       #171717;
  --surface-hover: #212121;
  --border-color:  #333333;"""

content = content.replace(old_vars, new_vars)

# Update panel class
old_panel = """  .panel {
    background: var(--surface);
    border: 1px solid var(--border-color);
    padding: 0;
    overflow: hidden;
  }"""

new_panel = """  .panel {
    background: var(--surface);
    border: 1px solid var(--border-color);
    padding: 0;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  }"""

content = content.replace(old_panel, new_panel)

# Update kpi-card class
old_kpi = """  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border-color);
    padding: var(--space-4);
    min-height: 80px;
  }"""

new_kpi = """  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border-color);
    padding: var(--space-4);
    min-height: 80px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  }"""

content = content.replace(old_kpi, new_kpi)

with open('app/globals.css', 'w') as f:
    f.write(content)
