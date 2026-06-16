# JACK_AB_TEST_AND_KPI_PLAN

## Role
JACK designs CTR-oriented but compliant LINE OA tests.

## A/B Test Variables
| Variable | Version A | Version B |
|---|---|---|
| Hook style | Situation-first | Step-first |
| CTA | 看使用提醒 | 看今日組合 |
| Visual | Scenario photo | Step diagram |
| Audience | 上班族 | 久站族 |
| Offer timing | Education first | Offer first |

## KPI Fields
- message_id
- date
- platform
- audience
- hook_type
- title
- button_text
- visual_type
- compliance_status
- human_approved
- sent_manually
- open_count
- click_count
- ctr
- line_friend_adds
- order_notes

## Initial Test Recommendation
Run no more than two major variables per week. Start with:
Week 1: situation-first vs step-first.
Week 2: scenario visual vs step diagram.
Week 3: correct-use CTA vs offer CTA.
Week 4: audience-specific hooks.

## Safety Guard
High CTR is not success if it comes from implied medical cure. Any winner must still pass Sky review.
