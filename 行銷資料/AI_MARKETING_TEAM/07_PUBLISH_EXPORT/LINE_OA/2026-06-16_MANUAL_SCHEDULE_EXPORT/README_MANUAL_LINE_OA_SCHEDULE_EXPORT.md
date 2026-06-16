# LINE OA 手動排程匯出版

產生日期：2026-06-16

## 用途

這份 CSV 是給人工操作 LINE OA 後台排程用，不是 API 發送檔。

## 安全狀態

- 總筆數：360
- 發布方式：人工複製/貼上到 LINE OA 後台
- 不含 token
- 不含 LINE API endpoint
- 不自動發布
- publish_allowed=MANUAL_ONLY_NOT_API

## 欄位說明

- schedule_date：建議排程日期
- schedule_time：建議排程時間
- line_message_type：訊息類型
- line_title：後台辨識用標題
- line_body：可複製貼上的 LINE 文字
- cta_text：建議 CTA
- image_asset_needed：圖片素材需求
- sset_status：素材是否需人工上傳或選圖
- compliance_status：合規乾跑狀態
- owner_approval_status：人工核准狀態
- manual_schedule_status：人工排程狀態
- 	ruth_basis：內容依據
- pre_publish_checklist：發布前人工確認事項

## 操作提醒

1. 先確認圖片素材與實際優惠/客服/出貨資訊。
2. 逐筆複製 line_body 到 LINE OA 後台。
3. 依 schedule_date 與 schedule_time 排程。
4. 不要把此 CSV 匯入任何會自動呼叫 LINE API 的流程。

## Gemini CLI Review

Conclusion: 完全適合作為 LINE OA 後台手動排程用途，且絕對禁止用於 API 自動發文。

Gemini critical findings:
- No LINE API endpoint, Bearer token, private key, or X-Line-Signature found.
- `publish_allowed=MANUAL_ONLY_NOT_API` and `manual_schedule_status=READY_FOR_MANUAL_LINE_OA_INPUT` correctly prevent API automation use.

Gemini important findings:
- Date range is future-aligned: 2026-06-17 to 2026-12-13.
- Rows=360, MissingColumns=0, BlankBody=0.

Final status: READY_FOR_MANUAL_LINE_OA_INPUT_NOT_FOR_API_AUTO_PUBLISHING.
