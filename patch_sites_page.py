import re

with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

# For Site Details table
content = content.replace(
    '<DataTable data={siteRows} columns={siteColumns} />',
    '<DataTable data={siteRows} columns={siteColumns} pagination={true} pageSize={15} />'
)

# For Location Directory table
content = content.replace(
    '<DataTable data={locationRows} columns={locationColumns} />',
    '<DataTable data={locationRows} columns={locationColumns} pagination={true} pageSize={15} />'
)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
