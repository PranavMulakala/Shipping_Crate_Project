# BrokerDocs — Project Guide & Machine Ground Rules

**Personal project on a work-owned machine. Keep it 100% isolated from work
identity, credentials, and files. These rules are non-negotiable and persist
across sessions. Read them before doing anything in this repo.**

## What this is
A clickable, front-end-only mockup of a freight-broker document tool (rate
confirmations + bills of lading), for customer-discovery demos. It is a
prototype, not a product: no backend, no database, no auth, no API calls. All
data is hardcoded seed data held in React state. A refresh resetting to seed
data is expected.

---

## Machine ground rules (non-negotiable)

### Filesystem
- All work stays under `~/personal/`. This project lives at
  `~/personal/Shipping_Crate_Project/`.
- NEVER read, write, or touch `~/ia-*`, `~/oas-*`, or `~/oas-slack-botv3/.env`.

### Work connectors
- Do NOT authorize or use Atlassian/Jira/Confluence/Rovo, Gmail, or Slack.
  This project needs no connectors. Leave them untouched.

### Secrets
- No secrets are used or stored in this project. Never read the work `.env`.
- Never hardcode or commit a secret.
- `.gitignore` must include: `.env*`, `secrets/`, `*.pem`, `*.key`,
  `credentials*`, `.venv/`, `node_modules/`, `dist/`, and any scratch/output dir.

### Git identity (personal only — set LOCALLY in this repo)
- There is no global git identity on this machine; do not rely on one.
- This repo's local identity is:
  - `user.email = pmulakala90@gmail.com`
  - `user.name  = Pranav Mulakala`
- NEVER commit as an `@sage.com` identity.

### GitHub / remote
- `gh` on this machine is authenticated as the WORK account — do NOT use it for
  this repo.
- The personal remote (only if/when explicitly asked to push) is:
  `git@github.com:PranavMulakala/Shipping_Crate_Project.git`, over SSH using
  `~/.ssh/key_github_personal` with the personal GitHub account.
- Do NOT create a remote or push anything without the owner explicitly saying
  "push". Local commits are fine.

### AWS / SSH keys
- Don't use AWS. Personal SSH key is `key_github_personal` ONLY. Never use
  `key_pranav.mulakala` or `oas_awx_automation`.

### Isolation
- Work on a local feature branch (`build/mockup`), not straight on `main`.
- Any scratch/test files go in the gitignored `scratch/` directory.

### Memory
- Project memory is directory-scoped and personal-only. NEVER write OAS/OBIEE
  or any work context into it.

---

## Tech stack
Vite + React + TypeScript, Tailwind CSS, lucide-react, react-router-dom.
Run with `npm install` then `npm run dev`. That is the whole deploy story.

## Hard product constraints
- No backend / DB / auth / API calls. "Download PDF" = `window.print()` with
  print CSS. Documents are styled HTML pages.
- All data is hardcoded seed data in React state; no localStorage/sessionStorage.
- Build ONLY what is specified. No extra features.
