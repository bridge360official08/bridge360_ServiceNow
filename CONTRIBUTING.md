# Bridge360 Team Collaboration & Contributing Guide

Welcome to the Bridge360 project. This repository serves as the central source of truth for all source code collaboration.

Please read and follow these guidelines carefully to ensure safe, conflict-free, and coordinated team development.

---

## 1. Repository Architecture

* **Central GitHub Repository**: `https://github.com/bridge360official08/bridge360_ServiceNow.git`
* **Stable Branch (`main`)**: Represents tested, reviewed, and approved code. **Direct commits to `main` are strictly prohibited.**
* **Team Branches**: Every team member creates their own feature/task branch from `main` when beginning work. Branch names are chosen by the developer to reflect the task (e.g., `feat/passport-extraction`, `fix/dob-parsing`).

```
                         GitHub Repository
                               │
                               ▼
                            main
                         Stable Code
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Team Member A   Team Member B   Team Member C
          Own Branch      Own Branch      Own Branch
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                         Pull Request
                               │
                               ▼
                         Code Review
                               │
                               ▼
                         Merge into main
                               │
                               ▼
                    Latest Approved Code
                               │
                               ▼
                  Controlled ServiceNow
                       Deployment/Testing
```

---

## 2. Standard 11-Step Team Member Workflow

Follow this sequence for every unit of work:

### Step 1: Update your local `main`
Ensure you are branching off the latest approved code:
```bash
git checkout main
git pull origin main
```

### Step 2: Create a new branch
Choose a descriptive branch name reflecting your task:
```bash
git checkout -b <your-branch-name>
```
*(Do not use generic names. Choose your own meaningful name).*

### Step 3: Make your code changes
Work strictly within your branch. Keep changes focused and relevant.

### Step 4: Review your changes locally
Verify exactly what was touched before staging:
```bash
git status
git diff
```

### Step 5: Stage and commit
Write clear, meaningful commit messages:
```bash
git add .
git commit -m "<type>: <brief description of changes>"
```
*Examples: `feat: add OCR bounding-box filter`, `fix: handle null expiry date in license`*

### Step 6: Push your branch to GitHub
```bash
git push -u origin <your-branch-name>
```

### Step 7: Open a Pull Request (PR)
On GitHub, open a PR from `<your-branch-name>` targeting `main`. Describe your changes and link any related tasks.

### Step 8: Code Review
At least one teammate must review and approve the Pull Request. Address any feedback or requested changes.

### Step 9: Merge into `main`
Once approved and CI/checks pass, merge the PR into `main`. Delete the feature branch on GitHub after merging.

### Step 10: Pull the latest `main`
All teammates can now sync the latest changes into their local environment:
```bash
git checkout main
git pull origin main
```

### Step 11: Update in-flight branches
If you have an active feature branch, rebase or merge `main` into your branch to stay up to date:
```bash
git checkout <your-branch-name>
git merge main
```

---

## 3. Resolving Merge Conflicts

If a conflict occurs when merging `main`:
1. Run `git status` to locate conflicting files.
2. Open each file, inspect the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and discuss with your teammate if needed.
3. Keep the valid code, remove conflict markers, and test locally.
4. Stage resolved files:
   ```bash
   git add <resolved-file>
   git commit -m "chore: resolve merge conflicts with main"
   ```

---

## 4. CRITICAL: Shared ServiceNow Instance vs. Git Branches

> [!IMPORTANT]
> **Git branches isolate source code. Git branches DO NOT create separate ServiceNow instances.**

All team members currently share the **same live ServiceNow instance**. Deploying changes immediately affects every other teammate's runtime environment.

### Coordinated Deployment Rules
1. **Never deploy experimental or unapproved branches to the shared instance.** Only code that has been reviewed, approved, and merged into `main` should normally be deployed.
2. **Coordinate with teammates before deploying:**
   - Confirm the commit/PR being deployed.
   - Check if another member is actively testing or editing that ServiceNow artifact.
   - Validate the instance immediately after deployment.
3. **DO NOT run casual full `sdk:deploy`:**
   - Running full `sdk:deploy` (`npx @servicenow/sdk install`) can overwrite newer live artifacts and configuration on the shared instance.
   - Use targeted deployment or selective script updates unless the full team explicitly reviews and agrees to a complete deploy.

---

## 5. Security & Secret Management

Never commit sensitive information to Git:
* **Excluded files**: `.env`, `.env.*` (except `.env.example`), credentials, API keys, passwords, bearer tokens, private keys, certificates, personal Windows/system paths, and session data.
* **Caches & Models**: `node_modules/`, `dist/`, `__pycache__/`, `.venv/`, and ML model weights (`*.pth`, `*.onnx`) must remain excluded.
* **Environment variables**: Use `.env.example` to document required variables with safe placeholder values. Store actual keys only in your local `.env`.

---

## 6. Golden Rules of Collaboration

1. **NO FORCE PUSH (`git push --force`)**: Never force-push to `main` or any shared branch.
2. **NO OVERWRITING WORK**: Never reset or overwrite another team member's branch.
3. **PRESERVE THE VALIDATED ARCHITECTURE**:
   - ServiceNow Document Intelligence is **PRIMARY**.
   - EasyOCR is **SECONDARY FALLBACK** only.
   - Dynamic document-field extraction is driven strictly by `u_bridge360_country_document_field` (Layer 1).
   - Do not hardcode country or document rules.
