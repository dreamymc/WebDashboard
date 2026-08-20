import re

with open('lib/google-sheets.ts', 'r') as f:
    content = f.read()

# Add to COL map
col_addition = """    Q4_BP:             findCol(['q4 bp']),
    ADDRESS:           findCol(['address']),
    RTB:               findCol(['rtb']),"""
content = content.replace("    Q4_BP:             findCol(['q4 bp']),", col_addition)

# Add to rows.push
push_addition = """      isPlan,
      address:          cell(raw, COL.ADDRESS),
      rtb:              cell(raw, COL.RTB),"""
content = content.replace("      isPlan,", push_addition)

with open('lib/google-sheets.ts', 'w') as f:
    f.write(content)
