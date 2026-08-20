import re

with open('lib/transforms.ts', 'r') as f:
    text = f.read()

funcs = [
  'programVelocity',
  'rfiRallyByVendor',
  'tcoPerformance',
  'tcoAwardStatus',
  'vendorCompletion',
  'rfiRallyDetailed',
  'wirelessIntegration',
  'transport'
]

for fn in funcs:
    # Find start of function
    pattern = r'(export function ' + fn + r'\(rows: SiteRow\[\]\): [^{]+\{)'
    match = re.search(pattern, text)
    if not match:
        print(f"Skipping {fn}")
        continue
    
    start_idx = match.end()
    
    # Find end of function by counting braces
    brace_count = 1
    end_idx = start_idx
    while brace_count > 0 and end_idx < len(text):
        if text[end_idx] == '{':
            brace_count += 1
        elif text[end_idx] == '}':
            brace_count -= 1
        end_idx += 1
    
    func_body = text[start_idx:end_idx-1]
    
    # Replace 'rows.' and 'for (const row of rows)' etc
    # We will just replace exactly 'rows' as a full word, EXCEPT in 'planRows' or 'rows: SiteRow[]'
    
    func_body = re.sub(r'\brows\b', 'planRows', func_body)
    
    new_func = match.group(1) + '\n  const planRows = rows.filter(r => r.isPlan);' + func_body + '}'
    
    text = text[:match.start()] + new_func + text[end_idx:]

with open('lib/transforms.ts', 'w') as f:
    f.write(text)

