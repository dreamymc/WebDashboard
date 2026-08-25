import re

with open('components/DataProvider.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import type { SiteRow, NewBuildPlanItem } from \"@/lib/types\";",
    "import type { SiteRow, NewBuildPlanItem, BuildPlanByMonthTableRow } from \"@/lib/types\";"
)

content = content.replace(
    "  newBuildPlan: NewBuildPlanItem[];\n  transforms: {",
    "  newBuildPlan: NewBuildPlanItem[];\n  buildPlanByMonthTable: BuildPlanByMonthTableRow[];\n  transforms: {"
)

content = content.replace(
    "  initialNewBuildPlan,\n  children,",
    "  initialNewBuildPlan,\n  initialBuildPlanByMonthTable,\n  children,"
)

content = content.replace(
    "  initialNewBuildPlan: NewBuildPlanItem[];\n  children: ReactNode;",
    "  initialNewBuildPlan: NewBuildPlanItem[];\n  initialBuildPlanByMonthTable: BuildPlanByMonthTableRow[];\n  children: ReactNode;"
)

content = content.replace(
    "    () => ({ rawRows: initialRows, filteredRows, newBuildPlan: initialNewBuildPlan, transforms }),\n    [initialRows, filteredRows, initialNewBuildPlan, transforms]",
    "    () => ({ rawRows: initialRows, filteredRows, newBuildPlan: initialNewBuildPlan, buildPlanByMonthTable: initialBuildPlanByMonthTable, transforms }),\n    [initialRows, filteredRows, initialNewBuildPlan, initialBuildPlanByMonthTable, transforms]"
)

with open('components/DataProvider.tsx', 'w') as f:
    f.write(content)
