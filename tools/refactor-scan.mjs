import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.mjs')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcFiles = walk('src');
const exportsMap = new Map();
const importsList = [];

// Parse files roughly
srcFiles.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const lines = code.split('\n');
  lines.forEach((l, idx) => {
    // very naive parsing for demo
    if (l.startsWith('export ')) {
      const match = l.match(/export (?:const|let|var|function|class) ([a-zA-Z0-9_]+)/);
      if (match) {
        if (!exportsMap.has(match[1])) exportsMap.set(match[1], []);
        exportsMap.get(match[1]).push(f.replace(/\\/g, '/'));
      }
    }
    if (l.startsWith('import ')) {
      importsList.push({ file: f.replace(/\\/g, '/'), line: idx + 1, text: l.trim() });
    }
  });
});

let findings = '# FINDINGS.md\n\n| ID | Severity | File:Line | Evidence | Proposed Fix |\n|---|---|---|---|---|\n';

// S1: Unresolved imports
importsList.forEach(imp => {
  const match = imp.text.match(/import \{([^}]+)\} from '([^']+)'/);
  if (match) {
    const vars = match[1].split(',').map(s => s.trim());
    const targetFile = match[2];
    
    vars.forEach(v => {
      // Just a stub for S1 analysis. Since doing real cross-file AST parsing is heavy,
      // we'll flag any import that has no known export in our map.
      if (v && !exportsMap.has(v) && !['THREE', 'OrbitControls', 'BufferGeometryUtils'].includes(v) && targetFile.startsWith('.')) {
        findings += `| S1 | BLOCKER | ${imp.file}:${imp.line} | \`${imp.text}\` (Missing \`${v}\`) | Implement missing export or correct path |\n`;
      }
    });
  }
});

// Write findings
fs.writeFileSync('c:/Users/dd/.gemini/antigravity-ide/brain/bbdcd9b1-f11d-45ab-88e5-945783a5fb65/FINDINGS.md', findings);
console.log('Scan complete. Wrote FINDINGS.md');
