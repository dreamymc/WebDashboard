const fs = require('fs');

let content = fs.readFileSync('lib/transforms.ts', 'utf8');

const functionsToUpdate = [
  'programVelocity',
  'rfiRallyByVendor',
  'tcoPerformance',
  'tcoAwardStatus',
  'vendorCompletion',
  'rfiRallyDetailed',
  'wirelessIntegration',
  'transport'
];

for (const fn of functionsToUpdate) {
  const regex = new RegExp(`(export function ${fn}\\(rows: SiteRow\\[\\]\\): [a-zA-Z\\[\\]]+ \\{\n)`);
  if (!content.match(regex)) {
    console.log("Could not match: " + fn);
    continue;
  }
  
  // Insert planRows definition right after function signature
  let newContent = content.replace(regex, `$1  const planRows = rows.filter(r => r.isPlan);\n`);
  
  // In the body of the function, replace 'rows' with 'planRows' for loops and filters
  // We have to be careful. We can just replace 'rows' with 'planRows' inside the function scope?
  // It's safer to just replace `rows` with `planRows` iteratively.
  
  // Let's do a regex that replaces \brows\b with planRows but ONLY within the function body!
}
