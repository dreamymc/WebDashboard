with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const renderLegendText = (value: string, entry: any) => (',
    'const renderLegendText = (value: string, entry: { payload: { value: number } }) => ('
)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
