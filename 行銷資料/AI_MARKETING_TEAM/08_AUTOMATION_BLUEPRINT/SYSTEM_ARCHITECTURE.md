# SYSTEM_ARCHITECTURE

## 本機資料層
產品資料、文案資料、圖片素材、競品資料、合規規則、貼文草稿、審核狀態、排程資料。

## AI 產出層
每日主題輸入 -> NORA 任務分派 -> MAYA/LEON/IRIS/JACK 產出 -> DR_LAW 合規審查 -> NORA 統整每日貼文包。

## 審核層
PENDING_REVIEW, APPROVED_TO_POST, REJECTED_OR_REWRITE, COMPLIANCE_REVIEW_LOG。

## 匯出層
CSV 給人工排程，JSON 給未來 API，Meta Business Suite/LINE OA/TikTok/抖音格式規劃。

## 未來自動發布層
Roadmap only. Do not implement publishing, login, upload, token storage or account changes. All publishing requires human approval.
