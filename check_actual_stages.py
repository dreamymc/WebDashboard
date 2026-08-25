import pandas as pd
import json

df = pd.read_excel('screenshotsForAntigravity/sheets.xlsx', sheet_name='Sheet3', header=1)
# Find the column containing 'LEAD INDICATOR'
col_name = [c for c in df.columns if isinstance(c, str) and 'LEAD INDICATOR' in c.upper()][0]

# Simulate normalizeLeadIndicator
def normalize(val):
    if pd.isna(val): return ''
    import re
    s = str(val)
    # Remove bracketed prefixes
    s = re.sub(r'^\[\d+\]\s*', '', s)
    return s.strip()

unique_vals = [normalize(v) for v in df[col_name].dropna().unique()]
print(json.dumps(unique_vals, indent=2))
