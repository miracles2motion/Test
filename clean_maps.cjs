const fs = require('fs');

let levelCode = fs.readFileSync('src/level.js', 'utf8');

// The 5x and harbor_port blocks in export const LEVELS:
// We can just find the start of `{ key: 'harbor_port'` and `{ key: '5x'` and remove until the next `  },` or `  }` 
function removeLevelEntry(code, key) {
    const startIdx = code.indexOf(`  {\n    key: '${key}'`);
    if (startIdx === -1) {
        const altIdx = code.indexOf(`{ key: '${key}'`);
        if (altIdx === -1) return code;
        let endIdx = code.indexOf(`}`, altIdx);
        // Find the comma if it exists
        if (code[endIdx+1] === ',') endIdx++;
        return code.slice(0, altIdx) + code.slice(endIdx + 1);
    }
    
    // Find the end of this block. It ends with `  },` or `  }` before the next `  {` or `];`
    // We can count braces.
    let braceCount = 0;
    let endIdx = -1;
    let started = false;
    for (let i = startIdx; i < code.length; i++) {
        if (code[i] === '{') {
            braceCount++;
            started = true;
        } else if (code[i] === '}') {
            braceCount--;
            if (started && braceCount === 0) {
                endIdx = i;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        if (code[endIdx+1] === ',') endIdx++;
        return code.slice(0, startIdx).trimEnd() + '\n' + code.slice(endIdx + 1).trimStart();
    }
    return code;
}

levelCode = removeLevelEntry(levelCode, 'harbor_port');
levelCode = removeLevelEntry(levelCode, '5x');

// Remove imports
levelCode = levelCode.split('\n').filter(line => !line.includes('harbor_port') && !line.includes('5x')).join('\n');

fs.writeFileSync('src/level.js', levelCode);
