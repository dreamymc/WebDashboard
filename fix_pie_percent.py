with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'label={({ percent }) => `${(percent * 100).toFixed(0)}%`}',
    'label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}'
)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
