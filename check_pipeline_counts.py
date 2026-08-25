import pandas as pd
import json

df = pd.read_excel('screenshotsForAntigravity/sheets.xlsx', sheet_name='Sheet3', header=1)
li_col = [c for c in df.columns if isinstance(c, str) and 'LEAD INDICATOR' in c.upper()][0]

def normalize(val):
    if pd.isna(val): return ''
    import re
    s = str(val)
    s = re.sub(r'^\[\d+\]\s*', '', s)
    return s.strip()

unique_vals = df[li_col].dropna().apply(normalize).value_counts().to_dict()
print(json.dumps(unique_vals, indent=2))
