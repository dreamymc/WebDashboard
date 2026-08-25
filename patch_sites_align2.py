import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '{ key: "id", header: "SERIAL NUMBER", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> }',
    '{ key: "id", header: "SERIAL NUMBER", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span>, align: "center" }'
)

content = content.replace(
    '{ key: "leadIndicator", header: "LEAD INDICATOR", cell: (r) => <StageBadge stage={r.leadIndicator} /> }',
    '{ key: "leadIndicator", header: "LEAD INDICATOR", cell: (r) => <StageBadge stage={r.leadIndicator} />, align: "center" }'
)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
