import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

# Replace all occurrences of bracketed stages with their unbracketed versions
content = content.replace("'[04] RTB'", "'RTB'")
content = content.replace("'[06] S-RFI'", "'S-RFI'")
content = content.replace("'[11] TRFS'", "'TRFS'")
content = content.replace("'[10] ON-AIR'", "'ON-AIR'")
content = content.replace("'[08] RFI'", "'RFI'")
content = content.replace("'[09] RFI with TRS'", "'RFI with TRS'")
content = content.replace("'[07] S-RFI w/ TRS'", "'S-RFI w/ TRS'")

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
