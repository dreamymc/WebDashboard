with open('lib/types.ts', 'r') as f:
    content = f.read()

new_type = """
export interface BuildPlanByMonthTableRow {
  category: string;
  jan: number | string | null;
  feb: number | string | null;
  mar: number | string | null;
  apr: number | string | null;
  may: number | string | null;
  jun: number | string | null;
  jul: number | string | null;
  aug: number | string | null;
  sep: number | string | null;
  oct: number | string | null;
  nov: number | string | null;
  dec: number | string | null;
  total: number | string | null;
}
"""

content = content + new_type

with open('lib/types.ts', 'w') as f:
    f.write(content)
