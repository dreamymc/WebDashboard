import re

with open('app/(dashboard)/layout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { fetchSheetRows, fetchSheet2BuildPlan } from \"@/lib/google-sheets\";",
    "import { fetchSheetRows, fetchSheet2BuildPlan, fetchBuildPlanByMonthTable } from \"@/lib/google-sheets\";"
)

content = content.replace(
    """  const [rows, newBuildPlan] = await Promise.all([
    fetchSheetRows(),
    fetchSheet2BuildPlan(),
  ]);""",
    """  const [rows, newBuildPlan, buildPlanByMonthTable] = await Promise.all([
    fetchSheetRows(),
    fetchSheet2BuildPlan(),
    fetchBuildPlanByMonthTable(),
  ]);"""
)

content = content.replace(
    "<DataProvider initialRows={rows} initialNewBuildPlan={newBuildPlan}>",
    "<DataProvider initialRows={rows} initialNewBuildPlan={newBuildPlan} initialBuildPlanByMonthTable={buildPlanByMonthTable}>"
)

with open('app/(dashboard)/layout.tsx', 'w') as f:
    f.write(content)
