with open('lib/google-sheets.ts', 'r') as f:
    content = f.read()

content = content.replace("import { normalizeProgram, normalizeMonth, parseCoord, normalizeVendor }", "import { normalizeProgram, normalizeMonth, parseCoord, normalizeVendor, normalizeLeadIndicator }")

with open('lib/google-sheets.ts', 'w') as f:
    f.write(content)
