---
trigger: always_on
description: Always automatically commit and push changes to GitHub
---

# Auto-Push to GitHub Rule

Whenever tasks, code edits, or bug fixes are completed:
1. Verify git status and validate the codebase.
2. Stage all relevant modifications (`git add ...`).
3. Commit with a concise and descriptive message.
4. DO NOT PUSH! Leave the repository ready for the user to push manually in their own terminal.
5. Ensure the working tree is clean.
