import re

with open('components/charts/SimplePieChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Legend verticalAlign="bottom" height={36} iconType="circle" />',
    '<Legend layout="vertical" verticalAlign="middle" align="left" iconType="circle" wrapperStyle={{ fontSize: "12px", paddingLeft: "10px" }} />'
)

with open('components/charts/SimplePieChart.tsx', 'w') as f:
    f.write(content)
