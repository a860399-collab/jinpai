# LINE OA 360 則人工審核包

建立日期：2026-06-16

## 審核狀態

這批內容尚未核准發布。

- eviewer_decision 預設：PENDING
- publish_allowed 預設：NO
- inal_publish_status 預設：NOT_APPROVED
- 不呼叫 LINE API
- 不自動發布

## 審核優先級

- P1_REWRITTEN_RECHECK：5
- P2_SAFE_TERM_CHECK：345
- P3_STANDARD_REVIEW：10

## 檔案

- 總審核表：$master
- P1 重寫後複審 5 筆：$p1
- P2 安全用語人工檢查 345 筆：$p2
- P3 標準複核 10 筆：$p3
- 人工決策模板：$decisionTemplate

## 允許的人工決策

只能填以下四種之一：

- APPROVE_FOR_MANUAL_SCHEDULE：核准進入人工排程匯出，不代表自動發布。
- NEEDS_REWRITE：退回 MAYA 改寫。
- REJECT：不使用。
- LEGAL_REVIEW：需要 DR_LAW 或人工法規再審。

## 審核重點

1. 不得有治療、根治、消炎治本、神效、一擦就好、保證有效等語氣。
2. 只能使用局部舒緩、暫時舒緩、按摩放鬆、日常保養、依標示使用。
3. 圖片 brief 不可暗示醫療效果。
4. 藥證、價格、優惠、客服、出貨、退換貨資訊需人工確認真實性。
5. 核准後也只能進入人工排程 CSV，不可直接自動發布。

## 前 20 筆待審核預覽

| ID | 優先級 | 日期 | 時間 | 主題 | 合規狀態 | 人工決策 |
|---|---|---|---|---|---|---|
| LINE_DRYRUN_017 | P1_REWRITTEN_RECHECK | 2026-06-25 | 12:00 | 輕微關節不適，日常保養要分清楚 | PASS_REWRITTEN_PENDING_HUMAN_REVIEW | PENDING |
| LINE_DRYRUN_087 | P1_REWRITTEN_RECHECK | 2026-07-30 | 12:00 | 輕微關節不適，日常保養要分清楚 | PASS_REWRITTEN_PENDING_HUMAN_REVIEW | PENDING |
| LINE_DRYRUN_157 | P1_REWRITTEN_RECHECK | 2026-09-03 | 12:00 | 輕微關節不適，日常保養要分清楚 | PASS_REWRITTEN_PENDING_HUMAN_REVIEW | PENDING |
| LINE_DRYRUN_227 | P1_REWRITTEN_RECHECK | 2026-10-08 | 12:00 | 輕微關節不適，日常保養要分清楚 | PASS_REWRITTEN_PENDING_HUMAN_REVIEW | PENDING |
| LINE_DRYRUN_297 | P1_REWRITTEN_RECHECK | 2026-11-12 | 12:00 | 輕微關節不適，日常保養要分清楚 | PASS_REWRITTEN_PENDING_HUMAN_REVIEW | PENDING |
| LINE_DRYRUN_001 | P2_SAFE_TERM_CHECK | 2026-06-17 | 12:00 | 運動後局部痠痛的保守處理 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_002 | P2_SAFE_TERM_CHECK | 2026-06-17 | 20:00 | 冬青油與清涼舒緩體感 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_003 | P2_SAFE_TERM_CHECK | 2026-06-18 | 12:00 | 早晨活動前的關節暖身 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_004 | P2_SAFE_TERM_CHECK | 2026-06-18 | 20:00 | 不能擦在破皮或傷口 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_005 | P2_SAFE_TERM_CHECK | 2026-06-19 | 12:00 | 芒種後濕熱生活保養 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_006 | P2_SAFE_TERM_CHECK | 2026-06-19 | 20:00 | 久站後小腿不適舒緩 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_007 | P2_SAFE_TERM_CHECK | 2026-06-20 | 12:00 | 你最常哪個部位緊繃 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_008 | P2_SAFE_TERM_CHECK | 2026-06-20 | 20:00 | 長輩外用膏使用安全 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_010 | P2_SAFE_TERM_CHECK | 2026-06-21 | 20:00 | 薄荷腦帶來的涼感來源 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_011 | P2_SAFE_TERM_CHECK | 2026-06-22 | 12:00 | 夏季冷氣房的肩頸保養 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_012 | P2_SAFE_TERM_CHECK | 2026-06-22 | 20:00 | 外用膏避免眼周與黏膜 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_013 | P2_SAFE_TERM_CHECK | 2026-06-23 | 12:00 | 為什麼我們重視藥證與標示 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_014 | P2_SAFE_TERM_CHECK | 2026-06-23 | 20:00 | 你習慣運動前還是運動後保養 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_015 | P2_SAFE_TERM_CHECK | 2026-06-24 | 12:00 | 搬重物後腰背保養 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |
| LINE_DRYRUN_016 | P2_SAFE_TERM_CHECK | 2026-06-24 | 20:00 | 樟腦外用時的注意界線 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK | PENDING |

## Gemini CLI Review

Conclusion: 完全符合人工審核流程。

Gemini critical findings:
- No critical issue found.
- No content is approved, scheduled, or published.

Gemini important findings:
- `APPROVE_FOR_MANUAL_SCHEDULE` is correctly defined as manual schedule export only, not auto-publishing.
- This preserves the final human gate for LINE OA.

Gemini minor findings:
- 360 rows match the priority split: 5 + 345 + 10.
- Initial status `PENDING` and `NOT_APPROVED` prevents accidental approval.

Final status: HUMAN_REVIEW_PACKAGE_READY_NOT_APPROVED_NOT_FOR_AUTO_PUBLISHING.

## Owner Approval + Gemini CLI Review

Owner decision: all 360 rows approved for manual schedule export only.

System state after approval:
- `reviewer_decision=APPROVE_FOR_MANUAL_SCHEDULE`: 360 rows
- `final_publish_status=APPROVED_FOR_MANUAL_SCHEDULE_ONLY`: 360 rows
- `publish_allowed=NO`: 360 rows
- `workflow_action=NO_LINE_API_CALL_NO_AUTO_PUBLISH_REVIEW_QUEUE_ONLY`: 360 rows
- ForbiddenHits: 0

Gemini conclusion:
- Critical: no issue; no accidental publishing risk.
- Important: three-layer lock remains in place: `_ONLY` final status, `publish_allowed=NO`, and no-auto-publish workflow action.
- Conclusion: complies with approval for manual schedule export only; automatic API publishing remains prohibited.

Final status: OWNER_APPROVED_FOR_MANUAL_SCHEDULE_EXPORT_ONLY_NOT_AUTO_PUBLISHING.
