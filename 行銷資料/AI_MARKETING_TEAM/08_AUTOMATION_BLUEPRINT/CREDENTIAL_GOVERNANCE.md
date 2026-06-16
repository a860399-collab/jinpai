# CREDENTIAL_GOVERNANCE

## Rule
Never write real API tokens, passwords, secrets, cookies, refresh tokens, account IDs or private keys into this project.

## Future Storage
If APIs are approved later, credentials must be stored outside repository documents using a human-managed secret store or platform credential vault.

## Approval Required
Each platform integration requires owner approval, legal/compliance approval, permission scope review, test account dry run and rollback plan.

## Future Secret Handling Recommendation
If API integration is approved in a later phase, prefer system environment variables, the automation platform credential vault, or a dedicated Secret Manager. Do not commit `.env` files; if a local `.env` is ever used for development, it must be listed in `.gitignore` and reviewed before any sharing or backup.
