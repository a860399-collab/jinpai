# LINE_OA_30_DAY_SAFE_INTEGRATION_BLUEPRINT

## Official Reference Summary
LINE Messaging API supports message sending types such as reply, push, multicast, narrowcast and broadcast. The API reference lists message endpoints including broadcast and validation endpoints, and the LINE Developers documentation states that the Messaging API can send messages to users.

Official docs also define channel access token handling. Because tokens are credentials, this project must not write them into files.

Sources:
- https://developers.line.biz/en/docs/messaging-api/sending-messages/
- https://developers.line.biz/en/reference/messaging-api/

## Scheduling Reality
The safe local system does not create actual LINE OA scheduled posts. It creates reviewable schedule data.

Two approved future paths:
1. Manual path: Owner reviews CSV, then schedules posts manually in LINE Official Account Manager.
2. Automation path: n8n/Task Scheduler reads only `APPROVED_TO_POST` rows, obtains credentials from vault/environment, validates message payload, then sends only after explicit Owner approval.

## Data Flow
Daily theme / 30-day calendar
-> MAYA LINE OA copy
-> IRIS SEO/education alignment
-> JACK A/B testing fields
-> Sky compliance pre-screen
-> NORA CSV export
-> Owner final approval
-> Manual LINE OA Manager scheduling

## Future API Guardrails
- Use vault or environment variables only.
- Validate message object before any real send.
- Require `human_approved=YES`.
- Require `status=APPROVED_TO_POST`.
- Reject all rows containing `PENDING`, `DRY_RUN`, `DO_NOT_UPLOAD`, or missing compliance status.
- Log every send attempt to local report.
- Provide emergency disable switch.

## Blocker
Before real automation, resolve `PHASE_6_SECURITY_BLOCKER_EXISTING_CREDENTIALS.md` regarding existing root-level credential-like files.
