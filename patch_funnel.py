with open('components/charts/FunnelBarChart.tsx', 'r') as f:
    content = f.read()

content = content.replace("height?: number;", "height?: number | string;")

with open('components/charts/FunnelBarChart.tsx', 'w') as f:
    f.write(content)
