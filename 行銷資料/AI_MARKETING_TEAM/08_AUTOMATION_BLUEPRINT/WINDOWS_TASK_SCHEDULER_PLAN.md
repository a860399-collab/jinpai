# WINDOWS_TASK_SCHEDULER_PLAN

Future only. Do not create or enable tasks in Phase 1.

1. A dry-run script reads daily command.
2. Windows Task Scheduler runs it at a chosen time.
3. Drafts are written to 05_DRAFT_OUTBOX/YYYY-MM-DD/.
4. Summary is appended to PENDING_REVIEW.
5. Owner is notified for manual review.
6. After approval, export CSV manually.

Future n8n can connect Google Sheets, Meta Business Suite, LINE OA, Gmail, Notion or local reports only after human approval.
