# REVIEW_SOP

## Purpose
Turn AI drafts into human-reviewed, legally safer content without direct publishing.

## Steps
1. Confirm draft exists in `05_DRAFT_OUTBOX/YYYY-MM-DD/`.
2. Confirm DR_LAW status exists.
3. Search for forbidden words from `FORBIDDEN_CLAIMS.md`.
4. Confirm safety reminder is present where needed.
5. Confirm price, offer and stock are fact-checked.
6. Confirm images come from `SAFE_IMAGE_REGISTRY.md` or are manually cleared.
7. Mark decision in `PENDING_REVIEW.md`.
8. Only human-approved rows may be copied to `APPROVED_TO_POST.md`.

## Decisions
- APPROVED_TO_POST
- NEEDS_REWRITE
- REJECTED
- NEEDS_FACT_CHECK

## Non-Negotiable
AI PASS does not equal publication approval.
