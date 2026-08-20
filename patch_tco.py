import re

with open('app/(dashboard)/vendors-tco/page.tsx', 'r') as f:
    content = f.read()

# Replace all occurrences of bracketed stages with their unbracketed versions
content = content.replace('"[01] AWARDED / SITE HUNTING"', '"AWARDED / SITE HUNTING"')
content = content.replace('"[03] TSSR APPROVED"', '"TSSR APPROVED"')
content = content.replace('"[04] RTB"', '"RTB"')
content = content.replace('"[05] CW DOING"', '"CW DOING"')

with open('app/(dashboard)/vendors-tco/page.tsx', 'w') as f:
    f.write(content)
