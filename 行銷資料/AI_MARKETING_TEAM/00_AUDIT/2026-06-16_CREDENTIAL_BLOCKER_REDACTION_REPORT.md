# 2026-06-16 Credential Blocker Redaction Report

Scope: root-level LINE/n8n/Google credential blocker cleanup.
Secrets were not printed. Original secret values were overwritten with placeholders.

## Files Processed

| File | Before risk matches | After risk matches | Action |
|---|---:|---:|---|
| $name | 21 | 19 | redacted credentials / disabled external endpoints |
| $name | 13 | 11 | redacted credentials / disabled external endpoints |

## Gitignore Updated

Added ignore rules for `.env`, secret files, credential JSON files, service-account JSON files, and private-key patterns.

## Remaining Manual Requirement

Rotate any LINE or Google credentials that may have been exposed before this redaction. Redaction clears local project blocker but cannot invalidate already-exposed credentials.

## 2026-06-16 Disabled Workflow Stub Replacement

Action:
- Replaced invalid/risky root n8n workflow files with disabled dry-run stub JSON.
- Set active=false.
- Removed executable LINE API endpoint nodes and credential-bearing request nodes from these root workflow files.
- Preserved only a sticky note explaining that rebuild must use the safe blueprint after external credential rotation and manual approval.

Files replaced:
- n8n_workflow_金太極.json
- n8n_workflow_金太極_v5.json

Remaining requirement:
- Rotate/revoke any LINE, Google, n8n, or other credentials that may have existed outside this local project.
- Do not import or activate these workflows as production automations.
