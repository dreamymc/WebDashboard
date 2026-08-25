with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'dataKey="value"',
    'dataKey="value"\n            label={({ value }) => value}\n            labelLine={true}'
)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
