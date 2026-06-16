# NORA_LINE_OA_30_DAY_DISPATCH

Date: 2026-06-10
Owner request: 串接 LINE OA，每天自動發文預約 30 天，並派工 MAYA / IRIS / JACK。
Status: PLANNING_AND_DRY_RUN_ONLY

## NORA Decision
LINE OA 30 天發文先採安全三段式：

1. 30 天內容與 LINE OA 推播文案產出。
2. 匯出人工排程 CSV，Owner 最終審核後手動排程。
3. 未來若要 n8n/API 發送，需先解決既有憑證檔安全 blocker、建立 credential vault、完成 Gemini 審查與 Owner 明確批准。

## Hard Safety Rules
- No LINE login.
- No Messaging API call.
- No channel access token.
- No n8n activation.
- No auto broadcast.
- No schedule creation in LINE OA Manager by Codex.
- All rows start as `PENDING_OWNER_FINAL_APPROVAL`.

## Team Dispatch

### MAYA Social Research
任務：研究目前公開可見的同類產品與社群常見高點擊內容型態，輸出可轉化為 LINE OA 的文案規則。

交付：
- `MAYA_SOCIAL_CLICK_RESEARCH.md`
- Hook pattern library
- LINE OA 可用訊息結構

### IRIS Design / SEO
任務：把 30 天 LINE OA 主題與搜尋意圖、教育內容串起來，讓每一則推播可導向官網文章或使用提醒。

交付：
- 30 天內容主題與 SEO 延伸
- 安全提醒語句庫
- Landing page first-screen compliance reminder

### JACK Creative / Ads Test Design
任務：設計 LINE OA 推播 A/B 測試欄位、點擊率追蹤欄位、受眾分組。

交付：
- Hook A/B testing matrix
- KPI fields
- Message format test plan

### Sky / DR_LAW
任務：審查 30 天文案與推播主題，阻擋醫療宣稱。

交付：
- 合規審查欄位與阻擋規則

## NORA Output
- 30 天 LINE OA 排程 CSV 草案
- LINE OA 安全串接藍圖
- 角色派工與研究摘要
- Gemini CLI 審查紀錄
