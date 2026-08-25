with open('app/globals.css', 'r') as f:
    content = f.read()

content = content.replace(
    'background: var(--bg);',
    'background: var(--surface-hover);'
)

with open('app/globals.css', 'w') as f:
    f.write(content)
