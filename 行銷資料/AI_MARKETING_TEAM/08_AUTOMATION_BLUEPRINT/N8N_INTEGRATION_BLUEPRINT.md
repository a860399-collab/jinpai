# N8N_INTEGRATION_BLUEPRINT

## Purpose
Future n8n integration for review notification, reporting and approved export handoff. Not active in Phase 6.

## Proposed Nodes
1. Manual Trigger or Scheduled Trigger in disabled/dry-run mode.
2. Read approved CSV/Google Sheets rows.
3. Compliance status filter.
4. Human approval filter.
5. Notify reviewer via Gmail/Notion/local report.
6. Write export package.
7. Optional platform API nodes remain disabled until Phase 5 approval is complete.

## Guardrails
- No credential in workflow JSON committed to project.
- No publish node enabled by default.
- Every run writes a dry-run log.
- Human approval remains mandatory.
