import re

with open('components/tables/DataTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '  align?: "left" | "center" | "right";\n}',
    '  align?: "left" | "center" | "right";\n  headerAlign?: "left" | "center" | "right";\n}'
)

content = content.replace(
    """              <th
                key={col.key}
                style={{ textAlign: col.align || "left" }}
              >""",
    """              <th
                key={col.key}
                style={{ textAlign: col.headerAlign || col.align || "left" }}
              >"""
)

with open('components/tables/DataTable.tsx', 'w') as f:
    f.write(content)
