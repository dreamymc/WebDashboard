import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const filteredWI = useMemo\(\(\) => \{.*?\}, \[wirelessIntegration, selectedSiteId\]\);\n\n', '', content, flags=re.DOTALL)
content = re.sub(r'const filteredTR = useMemo\(\(\) => \{.*?\}, \[transport, selectedSiteId\]\);\n\n', '', content, flags=re.DOTALL)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
