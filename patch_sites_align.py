import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

# For every column definition in siteColumns and locationColumns that doesn't have an align property, add align: "center"
# Actually, it's easier to just do a regex replace on the column objects

# Find all occurrences of `{ key: "...", header: "..." }` and add `, align: "center"`
content = re.sub(r'(\{ key: "[^"]+", header: "[^"]+"(?:\s*,\s*cell: \([^)]+\) => [^}]+)?) \}', r'\1, align: "center" }', content)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
