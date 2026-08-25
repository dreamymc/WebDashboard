with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

old_func = """  const renderLegendText = (value: string, entry: { payload: { value: number } }) => (
    <span className="text-text-primary">{value} - {entry.payload.value}</span>
  );"""

new_func = """  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegendText = (value: string, entry: any) => (
    <span className="text-text-primary">{value} - {entry.payload?.value ?? 0}</span>
  );"""

content = content.replace(old_func, new_func)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
