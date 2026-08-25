import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Use regex to find .panel-header block and inject the background
content = re.sub(
    r'(\.panel-header\s*\{[^}]*)(?=\})',
    r'\1  background: var(--header-bg);\n',
    content
)

with open('app/globals.css', 'w') as f:
    f.write(content)
