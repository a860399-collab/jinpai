# N8N_HUMAN_APPROVAL_FLOW

1. Draft enters PENDING_REVIEW.
2. Human reviewer uses approval form.
3. Approved row is copied to APPROVED_TO_POST.
4. Export process creates approved CSV.
5. n8n dry run reads CSV and validates approval.
6. n8n sends notification/report only.
7. Future publish nodes stay disabled until separate approval.
