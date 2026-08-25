import pandas as pd
import json

df = pd.read_excel('screenshotsForAntigravity/sheets.xlsx', sheet_name='Sheet3', header=1)
# Find the column containing 'LEAD INDICATOR'
col_name = [c for c in df.columns if isinstance(c, str) and 'LEAD INDICATOR' in c.upper()][0]
unique_vals = df[col_name].dropna().unique().tolist()
print(json.dumps(unique_vals, indent=2))
