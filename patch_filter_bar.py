with open('components/layout/FilterBar.tsx', 'r') as f:
    content = f.read()

content = content.replace('<option value="">Prio 2...</option>', '<option value="">Priority Tagging...</option>')

with open('components/layout/FilterBar.tsx', 'w') as f:
    f.write(content)
