import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "{ name: 'Awarded/Site Hunting', value: counts.get('AWARDED / SITE HUNTING') ?? 0, fill: '#3b82f6' }",
    "{ name: 'Active', value: counts.get('AWARDED / SITE HUNTING') ?? 0, fill: '#3b82f6' }"
)

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
