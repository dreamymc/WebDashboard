import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'totalPipeline: rows.length,',
    "totalPipeline: rows.filter(r => !['FOR AWARDING', 'Returned/ Rejected', 'w/ ISSUES'].includes(r.leadIndicator)).length,"
)

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
