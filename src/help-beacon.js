/**
 * Doodle Strike - The Help Beacon
 * 
 * Invoked by Dream when a completely unrecoverable, fatal error occurs.
 * Generates a detailed crash report for AI/Human intervention.
 */

import fs from 'fs';
import path from 'path';

export function broadcastHelpBeacon(error, seed = 'Unknown', context = {}) {
  const rootDir = process.cwd();
  const crashFile = path.join(rootDir, 'fatal_crash.md');
  
  const timestamp = new Date().toISOString();
  
  const report = `
# 🚨 DREAM V2.0 FATAL CRASH REPORT 🚨

**Timestamp**: ${timestamp}
**Target Seed / Map**: ${seed}

## The Error
\`\`\`
${error.name || 'Error'}: ${error.message || error}
\`\`\`

## Stack Trace
\`\`\`
${error.stack || 'No stack trace available.'}
\`\`\`

## Pipeline Context
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

---
> **AUTOMATED MESSAGE**: Dream encountered an unprecedented error it could not self-heal. The orchestrator has safely halted execution to prevent corruption. Please investigate this trace and patch the pipeline.
`;

  fs.writeFileSync(crashFile, report.trim());
  console.log(`\n🚨 FATAL ERROR ENCOUNTERED!`);
  console.log(`🚨 Help-Beacon Activated: Wrote crash report to 'fatal_crash.md'.`);
  console.log(`🚨 Halting Dream execution to prevent data corruption.\n`);
}
