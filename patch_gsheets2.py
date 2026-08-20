with open('lib/google-sheets.ts', 'r') as f:
    content = f.read()

content = content.replace("import {\n  normalizeVendor,", "import {\n  normalizeVendor,\n  normalizeLeadIndicator,")
content = content.replace("leadIndicator:    cell(raw, COL.LEAD_INDICATOR),", "leadIndicator:    normalizeLeadIndicator(cell(raw, COL.LEAD_INDICATOR)),")

with open('lib/google-sheets.ts', 'w') as f:
    f.write(content)
