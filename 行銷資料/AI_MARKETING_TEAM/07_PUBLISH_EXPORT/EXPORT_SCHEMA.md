# EXPORT_SCHEMA

## Rule
Exports are for manual scheduling only after human approval. Phase 4 creates schemas and dry-run samples, not publishable files.

## CSV Fields
id, date, platform, status, human_approved, topic, hook, body, cta, hashtags, asset_brief, compliance_status, reviewer, notes

## JSON Fields
id, id, date, platform, status, human_approved, content, asset, compliance, export_warning

## Status Rules
- PENDING_REVIEW rows must not be uploaded.
- APPROVED_TO_POST rows can be manually scheduled by the owner.
- No API endpoint, token or credential may be included.

