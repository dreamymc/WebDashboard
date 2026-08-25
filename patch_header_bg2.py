import re

with open('app/globals.css', 'r') as f:
    content = f.read()

content = content.replace(
    '--header-bg: #e2e8f0;',
    '--header-bg: #cbd5e1;'
)

content = content.replace(
    '--header-bg: #27272a;',
    '--header-bg: #18181b;'
)

with open('app/globals.css', 'w') as f:
    f.write(content)
