import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Add to dark mode
content = content.replace("--border-color:  #333333;", "--border-color:  #333333;\n  --panel-shadow:  0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4);")

# Add to light mode
content = content.replace("--brand:         #0ea5e9;", "--brand:         #0ea5e9;\n  --panel-shadow:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);")

# Update panel class
content = content.replace("box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);", "box-shadow: var(--panel-shadow);")

with open('app/globals.css', 'w') as f:
    f.write(content)
