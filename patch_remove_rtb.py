with open('lib/types.ts', 'r') as f:
    content = f.read()
content = content.replace("  rtb: string;\n", "")
with open('lib/types.ts', 'w') as f:
    f.write(content)

with open('lib/google-sheets.ts', 'r') as f:
    content = f.read()
content = content.replace("    RTB:               findCol(['rtb']),\n", "")
content = content.replace("      rtb:              cell(raw, COL.RTB),\n", "")
with open('lib/google-sheets.ts', 'w') as f:
    f.write(content)

with open('lib/transforms.ts', 'r') as f:
    content = f.read()
content = content.replace("    rtb: r.rtb,\n", "")
with open('lib/transforms.ts', 'w') as f:
    f.write(content)
