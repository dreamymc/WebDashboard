with open('app/(dashboard)/sites/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("!hiddenStages.has(s.stage)", "!hiddenStages.has(s.leadIndicator)")
content = content.replace("stage: s.stage", "stage: s.leadIndicator")
content = content.replace("STAGE_COLORS[s.stage]", "STAGE_COLORS[s.leadIndicator]")

with open('app/(dashboard)/sites/page.tsx', 'w') as f:
    f.write(content)
