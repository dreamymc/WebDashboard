with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<DataTable data={filteredSiteTable} columns={siteColumns} />',
    '<DataTable data={filteredSiteTable} columns={siteColumns} pagination={true} pageSize={15} />'
)
content = content.replace(
    '<DataTable data={filteredLocation} columns={locationColumns} />',
    '<DataTable data={filteredLocation} columns={locationColumns} pagination={true} pageSize={15} />'
)

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
