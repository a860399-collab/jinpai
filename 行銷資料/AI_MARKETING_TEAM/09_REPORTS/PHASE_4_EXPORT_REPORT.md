# PHASE_4_EXPORT_REPORT

## Scope
CSV/JSON export planning and dry-run sample creation.

## Output
- Export schema
- Dry-run CSV sample marked DO_NOT_UPLOAD
- Dry-run JSON sample marked DO_NOT_UPLOAD
- Manual export checklist

## Safety
No API endpoint, credential, upload or scheduling was created.

## Gate Verification
The only legal source for a real manual export is `AI_MARKETING_TEAM/06_REVIEW_QUEUE/APPROVED_TO_POST.md`. Dry-run files, PENDING_REVIEW rows and files containing `DO_NOT_UPLOAD` or `DRY_RUN` must not be uploaded or scheduled.
