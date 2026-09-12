---
trigger: always_on
description: Always automatically commit and push changes to GitHub
---

# Local Commit Workflow

Whenever tasks, code edits, or bug fixes are completed:
1. Verify git status and validate the codebase.
2. Stage all relevant modifications (`git add ...`).
3. Commit with a concise and descriptive message.
4. **DO NOT** push to GitHub. Only commit locally. (The remote is set to a secure connection that requires manual desktop approval, so background pushes will freeze).
