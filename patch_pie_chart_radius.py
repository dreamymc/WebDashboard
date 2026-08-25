with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'innerRadius={60}',
    'innerRadius={45}'
)
content = content.replace(
    'outerRadius={100}',
    'outerRadius={75}'
)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
