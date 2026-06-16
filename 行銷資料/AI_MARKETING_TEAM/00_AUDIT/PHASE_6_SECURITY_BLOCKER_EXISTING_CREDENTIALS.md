# PHASE_6_SECURITY_BLOCKER_EXISTING_CREDENTIALS

## Status
BLOCKED_FOR_HUMAN_SECURITY_REVIEW

## What Happened
During Gemini CLI Phase 6 re-review, Gemini identified potential sensitive credentials and active external API connection logic in existing root-level project files outside `AI_MARKETING_TEAM/`.

Codex performed read-only verification and did not print secrets, delete files, move files, overwrite files, activate workflows, or connect to external services.

## Files Requiring Human Review
- `n8n_workflow_金太極.json`
- `n8n_workflow_金太極_v2.json`
- `automatic-opus-459114-u6-7169f79c1864.json`
- `.gitignore`

## Read-Only Signals Found
- Existing n8n workflow JSON files contain matches for external LINE API endpoint patterns and authorization/token-related fields.
- Existing Google service-account style JSON contains matches for private-key/client-email/token-related fields.
- `.gitignore` currently only contains `*.zip` and `*.mp4`; it does not currently ignore `.env`, credential JSON, service account JSON, or n8n credential exports.

## Why This Blocks Final Phase 6 Delivery
Phase 6 promises that n8n integration remains blueprint-only with no credentials, no endpoint calls, and no active publishing path. Even though the new `AI_MARKETING_TEAM/` files follow that rule, the surrounding project folder already contains files that appear to violate the same security boundary.

## Required Human Decision
Choose one before Phase 6 can be marked ready:

1. Allow Codex to create sanitized copies only, leaving originals untouched.
2. Allow Codex to redact credentials in the existing root files.
3. Allow Codex to move risky existing files into a human-approved quarantine folder.
4. Keep originals unchanged and accept Phase 6 as documentation-only with a documented security exception.

## Recommended Remediation
- Rotate any exposed LINE/Google credentials before future API use.
- Add `.env`, `*.secret.*`, `*credential*`, `*service-account*`, and risky workflow export patterns to `.gitignore` after owner approval.
- Store credentials only in n8n credential vault, OS environment variables, or a dedicated Secret Manager.
- Keep `AI_MARKETING_TEAM/08_AUTOMATION_BLUEPRINT/N8N_DRY_RUN_WORKFLOW_SPEC.md` as the safe target design.

## 2026-06-10 Update
Gemini CLI review for LINE OA 30-day planning also flagged root-level 
8n_workflow_金太極_v4.json as requiring human security review before any real automation. Codex verified that this file exists but did not print, modify, delete, move, or execute it.

## 2026-06-16 Remediation Update
Codex performed local redaction on the flagged root-level workflow/credential-like files. Sensitive-looking values were replaced with placeholders and LINE API endpoints were disabled to dry-run placeholder endpoints. `.gitignore` was strengthened for future secret/credential files.

Status: LOCAL_PROJECT_BLOCKER_REDACTED_PENDING_GEMINI_REVIEW

Important: local redaction does not rotate or invalidate any credentials that may have existed before. Owner should rotate LINE/Google credentials in the official dashboards before any future automation.

Redaction report: `行銷資料/AI_MARKETING_TEAM/00_AUDIT/2026-06-16_CREDENTIAL_BLOCKER_REDACTION_REPORT.md`

## 2026-06-16 Blocker Cleanup Finalization

Status: LOCAL_PROJECT_BLOCKER_CLEARED_PENDING_EXTERNAL_CREDENTIAL_ROTATION

Local project blocker status: CLEARED.

The remaining root n8n workflow JSON files were replaced with disabled dry-run stubs:
- n8n_workflow_金太極.json
- n8n_workflow_金太極_v5.json

What this clears:
- No local workflow should contain live LINE API endpoints.
- No local workflow should contain usable Bearer tokens, private keys, or service-account secrets.
- n8n workflow JSON files should parse as valid JSON and have active=false.

What this does not clear:
- Any credential that was previously exposed must still be rotated or revoked in the original external service dashboards.
- Direct LINE OA auto-posting remains blocked until the owner provides a new approved credential flow and manual review gate.

## 2026-06-16 Gemini CLI Review Result

Gemini CLI file-based review attempts timed out, so Codex ran a pure-text Gemini review against the local verification summary.

Gemini conclusion:
- Critical: Sensitive leakage risks were excluded in the verification summary, including LINE endpoints, Bearer tokens, private keys, and Google credential patterns.
- Important: .gitignore covers high-risk env/credential/service-account/private-key files, and n8n workflows are active=false.
- Minor: Workflows contain only one disabled sticky note node.
- Conclusion: The verification summary is sufficient to temporarily clear the local blocker, with external credential rotation and no-direct-publishing restrictions still required.

Final status: LOCAL_PROJECT_BLOCKER_CLEARED_PENDING_EXTERNAL_CREDENTIAL_ROTATION.
