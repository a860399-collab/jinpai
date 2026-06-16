# LINE OA 360 則乾跑待審核輸出

產生日期：2026-06-16

## 安全狀態

- 狀態：DRY_RUN_ONLY_PENDING_HUMAN_REVIEW
- 不呼叫 LINE API
- 不登入 LINE OA
- 不自動發布
- publish_allowed 一律為 NO
- 所有內容只進人工審核

## 來源

$source

## 輸出

- CSV：$csvOut
- JSON：$jsonOut

## 統計

- 總筆數：360
- 日期範圍：2026-06-04 到 2026-11-30
- PASS_DRY_RUN_PENDING_HUMAN_REVIEW：10
- NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK：345
- NEEDS_REWRITE_FORBIDDEN_TERMS：5

## 前 10 則預覽

| ID | 日期 | 時間 | 主題 | 合規乾跑狀態 |
|---|---|---|---|---|
| LINE_DRYRUN_001 | 2026-06-04 | 12:00 | 運動後局部痠痛的保守處理 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_002 | 2026-06-04 | 20:00 | 冬青油與清涼舒緩體感 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_003 | 2026-06-05 | 12:00 | 早晨活動前的關節暖身 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_004 | 2026-06-05 | 20:00 | 不能擦在破皮或傷口 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_005 | 2026-06-06 | 12:00 | 芒種後濕熱生活保養 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_006 | 2026-06-06 | 20:00 | 久站後小腿不適舒緩 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_007 | 2026-06-07 | 12:00 | 你最常哪個部位緊繃 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_008 | 2026-06-07 | 20:00 | 長輩外用膏使用安全 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |
| LINE_DRYRUN_009 | 2026-06-08 | 12:00 | 低頭族肩頸緊繃的三個提醒 | PASS_DRY_RUN_PENDING_HUMAN_REVIEW |
| LINE_DRYRUN_010 | 2026-06-08 | 20:00 | 薄荷腦帶來的涼感來源 | NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK |

## 下一步

1. 人工檢查 NEEDS_REWRITE_FORBIDDEN_TERMS。
2. 人工確認每則圖片素材與真實性依據。
3. 核准後才可匯出人工排程 CSV。
4. 任何 LINE OA 真實發送仍需另行核准與憑證治理。

## Gemini CLI Review

Conclusion: This output is acceptable as review-queue dry-run output and must not be used for publishing.

Gemini critical findings:
- 360 rows are locked with `publish_allowed=NO`.
- Workflow remains `active=false` and is limited to review queue output.
- No LINE endpoint, Bearer token, private key, or production credential pattern was found in the dry-run workflow.

Gemini important findings:
- 5 rows are `NEEDS_REWRITE_FORBIDDEN_TERMS` and must be rewritten before any approval.
- 345 rows are `NEEDS_HUMAN_REVIEW_SAFE_TERM_CHECK` and require human safety-language review.
- `humanReviewRequired=true`; no automated trust is granted.

Gemini minor findings:
- 24 rows are dated before 2026-06-16 and must be rescheduled before any future production scheduling.

Final dry-run status: REVIEW_QUEUE_OUTPUT_ONLY_NOT_FOR_PUBLISHING.
