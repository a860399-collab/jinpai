# N8N_DRY_RUN_WORKFLOW_SPEC

## Dry-Run Input
`07_PUBLISH_EXPORT/CSV/*DRY_RUN*.csv`

Dry-run files may be read only by the validation/reporting path. They must never be sent to a publish, upload, push, broadcast, ad-launch or external platform node.

## Dry-Run Output
`09_REPORTS/n8n_dry_run_log/YYYY-MM-DD_run.md`

## Validation Filters
- Reject if `human_approved` is not `YES` for any real export path.
- Reject if `status` is not `APPROVED_TO_POST` for any real export path.
- Allow `DRY_RUN` and `DO_NOT_UPLOAD` filenames only for local validation/report generation.
- Reject from any publish/export-to-platform node if filename contains `DO_NOT_UPLOAD` or `DRY_RUN`.

## Result
The dry run produces a local report only. It must not call Meta, LINE, TikTok, Douyin, Google Sheets, Gmail, Notion or any external publishing endpoint.
