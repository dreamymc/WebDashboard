import re

with open('components/DataProvider.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "  newBuildPlan: NewBuildPlanItem[];\n  transforms: ReturnType<typeof computeTransforms>;",
    "  newBuildPlan: NewBuildPlanItem[];\n  buildPlanByMonthTable: BuildPlanByMonthTableRow[];\n  transforms: ReturnType<typeof computeTransforms>;"
)

with open('components/DataProvider.tsx', 'w') as f:
    f.write(content)
