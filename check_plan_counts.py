import pandas as pd
import json

df = pd.read_excel('screenshotsForAntigravity/sheets.xlsx', sheet_name='Sheet3', header=1)
# Find 'LEAD INDICATOR' and 'Filter 1'
li_col = [c for c in df.columns if isinstance(c, str) and 'LEAD INDICATOR' in c.upper()][0]
f1_col = [c for c in df.columns if isinstance(c, str) and 'FILTER 1' in c.upper()][0]

def normalize(val):
    if pd.isna(val): return ''
    import re
    s = str(val)
    s = re.sub(r'^\[\d+\]\s*', '', s)
    return s.strip()

# Filter for rows where Filter 1 is '2026'
plan_df = df[df[f1_col].astype(str).str.strip().str.replace('.0', '') == '2026']

unique_vals = plan_df[li_col].dropna().apply(normalize).value_counts().to_dict()
print(json.dumps(unique_vals, indent=2))
