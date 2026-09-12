---
name: auto-push
description: Automatically commits and pushes workspace changes to GitHub origin main
---

# Auto-Push Workflow

Use this workflow to stage, commit, and push updates to the remote GitHub repository.

## Steps
1. Run `git status` to verify modified and untracked files.
2. Stage modified files using `git add <files>`.
3. Commit using `git commit -m "<message>"`.
4. Push to remote: `git push origin main`.
5. Confirm success with `git status`.
