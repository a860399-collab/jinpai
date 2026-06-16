# n8n Workflow 規格書 v1.0
# 《金牌一條根 LINE OA 自動貼文系統》
# 2026-06-01

---

## 一、系統概覽

### 版本選擇
| 版本 | 描述 | 建議使用時機 |
|------|------|------------|
| MVP 版 | 手動觸發，Claude 生成文案，人工圖片，人工發布 | 上線前 2 週驗證 |
| 標準版 | 自動排程，Claude 生成，DALL-E 圖片，人工審核後自動發布 | 正式上線 |
| 進階版 | 全自動 + SerpAPI 爆款搜尋 + Midjourney 圖片 + 成效追蹤 | Phase 3 |

### 環境需求
```
n8n 版本：1.x（建議 n8n Cloud 或自架 Docker）
Node.js：18+（自架時需要）
需要的 n8n 套件：
  - @n8n/n8n-nodes-base（內建）
  - n8n-nodes-google-sheets（內建）
```

---

## 二、所需 API 與帳號清單

| 服務 | 用途 | API Key 位置 | 費用 |
|------|------|------------|------|
| Anthropic Claude API | 文案生成 + 合規審查 | console.anthropic.com | 依用量 |
| OpenAI API（DALL-E 3）| 圖片生成 | platform.openai.com | $0.04/張 |
| LINE Messaging API | 發布貼文 | developers.line.biz | 免費（量限）|
| SerpAPI | Google 搜尋 + Trends | serpapi.com | $50/月起 |
| Google Sheets API | 資料儲存 | Google Cloud Console | 免費 |
| Notion API | 審核介面 | notion.so/my-integrations | 免費 |
| LINE Notify（選用）| 審核通知 | notify-bot.line.me | 免費 |

### n8n Credentials 設定清單
```
1. Claude API
   - Type: HTTP Header Auth
   - Header Name: x-api-key
   - Value: sk-ant-xxxxx

2. OpenAI API
   - Type: OpenAI Credentials
   - API Key: sk-xxxxx

3. LINE Messaging API
   - Type: HTTP Header Auth
   - Header Name: Authorization
   - Value: Bearer {CHANNEL_ACCESS_TOKEN}

4. Google Sheets
   - Type: Google Sheets OAuth2
   - Spreadsheet ID: {YOUR_SHEET_ID}

5. SerpAPI
   - Type: HTTP Query Auth
   - Parameter: api_key
   - Value: {YOUR_SERPAPI_KEY}
```

---

## 三、MVP 版 Workflow

### 3.1 MVP 節點清單（共 8 個節點）

```
[手動觸發] → [選主題] → [Claude 生成文案] → [合規審查] 
     → [儲存草稿] → [通知審核] → [等待核准] → [LINE 發布]
```

#### 節點 M1：Manual Trigger（手動觸發）
```
節點類型：Manual Trigger
用途：手動執行 workflow，生成一則貼文草稿
輸出：{ trigger_time: DateTime }
```

#### 節點 M2：Set Topic（設定主題）
```
節點類型：Set
用途：手動填入本次主題參數

設定欄位：
  topic_category: "A"  // A-H
  topic_name: "一條根草本使用指南"
  target_audience: "上班族、保健族群"
  content_angle: "步驟型"
  scheduled_slot: "19:00"
  season: "夏季"
  brand_link: true

輸出：{ topic_category, topic_name, target_audience, content_angle, scheduled_slot, season, brand_link }
```

#### 節點 M3：Claude — 文案生成
```
節點類型：HTTP Request
Method：POST
URL：https://api.anthropic.com/v1/messages

Headers：
  x-api-key: {{$credentials.claudeApiKey}}
  anthropic-version: 2023-06-01
  content-type: application/json

Body（JSON）：
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 2000,
  "system": "{{SYSTEM_PROMPT_完整版}}",
  "messages": [
    {
      "role": "user",
      "content": "主題分類：{{$json.topic_category}}\n主題名稱：{{$json.topic_name}}\n目標受眾：{{$json.target_audience}}\n發布時段：{{$json.scheduled_slot}}\n內容角度：{{$json.content_angle}}\n季節：{{$json.season}}\n\n請依標準格式完整輸出貼文。"
    }
  ]
}

輸出：
  { claude_response: String, raw_copy: String }
```

#### 節點 M4：Parse Copy（解析文案）
```
節點類型：Code（JavaScript）
用途：從 Claude 回應中提取各欄位

程式碼：
const response = $input.item.json.claude_response;

// 用正則解析各區塊
const extract = (label, text) => {
  const regex = new RegExp(`【${label}】[：:]([\\s\\S]*?)(?=【|═|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};

return [{
  json: {
    title: extract('貼文標題', response),
    hook: extract('第一句 Hook', response),
    copy_short: extract('短版文案', response),
    copy_full: extract('完整版文案', response),
    copy_card: extract('圖卡文案', response),
    cta: extract('CTA 行動呼籲', response),
    hashtags: extract('Hashtag', response),
    disclaimer: extract('免責聲明', response),
    image_concept: extract('圖片主視覺概念', response),
    image_prompt_1_1: extract('Midjourney / DALL-E Prompt — 方圖 1:1', response),
    compliance_result: extract('審查結果', response),
    compliance_flags: extract('風險項目', response),
    risk_level: extract('合規風險等級', response),
    needs_review: response.includes('是否需要人工審核：是'),
    line_preview: extract('LINE 訊息預覽', response),
    created_at: new Date().toISOString(),
    draft_id: 'DRAFT_' + Date.now()
  }
}];
```

#### 節點 M5：Compliance Gate（合規關卡）
```
節點類型：IF
條件：
  {{ $json.risk_level }} 等於 "高" 
  OR {{ $json.compliance_result }} 包含 "FAIL"

True（高風險）→ 標記需人工審核，繼續儲存
False（通過）→ 直接儲存
```

#### 節點 M6：Save to Google Sheets（儲存草稿）
```
節點類型：Google Sheets
Operation：Append Row
Spreadsheet：{SPREADSHEET_ID}
Sheet：Draft Posts

欄位對應：
  draft_id → {{ $json.draft_id }}
  title → {{ $json.title }}
  hook → {{ $json.hook }}
  copy_short → {{ $json.copy_short }}
  copy_full → {{ $json.copy_full }}
  copy_card → {{ $json.copy_card }}
  cta → {{ $json.cta }}
  hashtags → {{ $json.hashtags }}
  disclaimer → {{ $json.disclaimer }}
  image_concept → {{ $json.image_concept }}
  image_prompt → {{ $json.image_prompt_1_1 }}
  compliance_result → {{ $json.compliance_result }}
  risk_level → {{ $json.risk_level }}
  needs_review → {{ $json.needs_review }}
  status → "pending_review"
  created_at → {{ $json.created_at }}
```

#### 節點 M7：Notify Reviewer（通知審核）
```
節點類型：HTTP Request（LINE Notify）
Method：POST
URL：https://notify-api.line.me/api/notify

Headers：
  Authorization: Bearer {LINE_NOTIFY_TOKEN}
  Content-Type: application/x-www-form-urlencoded

Body：
  message=【新草稿待審核】
  標題：{{ $json.title }}
  風險：{{ $json.risk_level }}
  草稿ID：{{ $json.draft_id }}
  請至 Google Sheets 審核並標記 status=approved
```

#### 節點 M8：LINE Publish（手動觸發發布）
```
節點類型：HTTP Request
Method：POST
URL：https://api.line.me/v2/bot/message/broadcast

Headers：
  Authorization: Bearer {CHANNEL_ACCESS_TOKEN}
  Content-Type: application/json

Body：
{
  "messages": [
    {
      "type": "image",
      "originalContentUrl": "{{ $json.image_url }}",
      "previewImageUrl": "{{ $json.image_url }}"
    },
    {
      "type": "text",
      "text": "{{ $json.copy_full }}\n\n{{ $json.cta }}\n\n{{ $json.hashtags }}\n\n{{ $json.disclaimer }}"
    }
  ]
}
```

---

## 四、標準版 Workflow（完整自動化）

### 4.1 節點清單（共 16 個節點）

```
[Cron 排程] 
  → [讀取時段主題] 
  → [重複主題檢查] 
    → [已重複：選備用主題]
    → [未重複：繼續]
  → [Topic Selector]
  → [Trend Finder（SerpAPI）]
  → [Knowledge Gatherer]
  → [Content Planner（Claude）]
  → [Copy Generator（Claude）]
  → [Compliance Checker（Claude）]
    → [FAIL：退回修改或標記]
    → [PASS：繼續]
  → [Image Prompt Generator（Claude）]
  → [Image Generator（DALL-E 3）]
  → [Layout Formatter]
  → [Draft Saver（Google Sheets）]
  → [Human Review Gate（Notion）]
    → [核准：LINE Publisher]
    → [拒絕：Log & Archive]
  → [Log / Archive]
  → [Performance Tracker（每日批次）]
```

### 4.2 各節點完整規格

#### 節點 S1：Cron Trigger（自動排程）
```
節點類型：Schedule Trigger
Cron 表達式：0 7,12,19,21 * * *
（嚴格版：每天 07:00 / 12:00 / 19:00 / 21:00）

強推版 Cron：0 6,8,10,12,14,16,18,20,22 * * *
（每 2 小時一次）

輸出：
  { 
    trigger_time: "2026-06-01T07:00:00",
    hour: 7,
    scheduled_slot: "07:00",
    day_of_week: "Monday"
  }
```

#### 節點 S2：Time Slot Router（時段路由）
```
節點類型：Switch
條件：{{ $json.hour }}

Case 7 → topic_pillar = "D", topic_hint = "晨安太極養生"
Case 12 → topic_pillar = "F", topic_hint = "飲食知識午間"
Case 19 → topic_pillar = "A", topic_hint = "一條根保健知識"
Case 21 → topic_pillar = "H", topic_hint = "晚間互動養生"

週一額外規則：
  hour 7 → pillar = "B"（上班族保健週一激勵）
週五額外規則：
  hour 19 → pillar = "E"（週五哲思五行八卦）
```

#### 節點 S3：Duplicate Checker（重複主題檢查）
```
節點類型：Google Sheets（Read Rows）
查詢條件：
  - Sheet：Published Posts
  - Filter：topic_category = {{ $json.topic_pillar }}
  - Filter：published_at >= 今天 - 7天
  - Count rows

IF count > 2（同一主題本週已發 2 次以上）：
  → 選下一個主題支柱（輪替邏輯）
ELSE：
  → 繼續
```

#### 節點 S4：Topic Selector（主題選擇器）
```
節點類型：HTTP Request（讀取 Google Sheets Topic Library）
或：Code 節點直接從陣列選

邏輯：
  1. 讀取 Topic Library 中符合 pillar 的主題
  2. 過濾掉 last_used_date 在 3 天內的主題
  3. 按 priority 排序
  4. 選最高優先的未用主題

輸出：
  {
    topic_id: "T042",
    topic_name: "肩頸舒緩三步驟",
    pillar: "B",
    keywords: ["肩頸", "舒緩", "上班族"],
    content_angle: "步驟型"
  }
```

#### 節點 S5：Trend Finder（爆款靈感搜尋）
```
節點類型：HTTP Request
URL：https://serpapi.com/search.json
Method：GET

Parameters：
  q: {{ $json.keywords.join(' ') + ' 養生 保健 2026' }}
  api_key: {{ $credentials.serpApiKey }}
  num: 5
  hl: zh-tw
  gl: tw

輸出處理（Code 節點）：
  擷取前 5 筆結果的：
  - title（標題）
  - snippet（摘要）
  - link（來源）
  
  拆解結構：
  - hook_type（從標題判斷：數字型/問句型/步驟型）
  - topic_angle（主題角度）

最終輸出：
  {
    trend_sources: [...],
    hook_ideas: ["標題寫法1", "標題寫法2"],
    structural_ideas: ["結構描述1"]
  }
```

#### 節點 S6：Knowledge Gatherer（知識素材蒐集）
```
節點類型：HTTP Request（Perplexity API）
URL：https://api.perplexity.ai/chat/completions
Method：POST

Body：
{
  "model": "llama-3.1-sonar-small-128k-online",
  "messages": [
    {
      "role": "user",
      "content": "請用繁體中文整理「{{ $json.topic_name }}」的正確保健知識，包含：1. 核心觀念 2. 實用建議 3. 注意事項。請以衛教角度，不做任何醫療療效宣稱。"
    }
  ]
}

輸出：
  {
    knowledge_points: ["知識點1", "知識點2"],
    safe_statements: ["安全表達方式1"],
    references: ["參考來源"]
  }
```

#### 節點 S7：Content Planner（內容規劃）
```
節點類型：HTTP Request（Claude API）
Prompt：
  "根據以下資料，決定本次貼文的最佳寫作策略：
  主題：{{ $json.topic_name }}
  受眾：{{ $json.target_audience }}
  時段：{{ $json.scheduled_slot }}
  爆款靈感：{{ $json.hook_ideas }}
  知識要點：{{ $json.knowledge_points }}
  
  請輸出：
  - chosen_angle: 選用的內容角度
  - hook_strategy: Hook 寫法策略
  - structure: 文案結構（3步驟描述）
  - tone: 本次語氣（偏知識型/偏互動型/偏療癒型）
  - estimated_length: 建議字數"

輸出：
  { chosen_angle, hook_strategy, structure, tone, estimated_length }
```

#### 節點 S8：Copy Generator（文案生成）
```
節點類型：HTTP Request（Claude API）
Model：claude-sonnet-4-6
Max Tokens：2500

System Prompt：（使用完整版 System Prompt，見 Prompt 模板文件）

User Prompt：
  "主題分類：{{ $json.pillar }}
  主題名稱：{{ $json.topic_name }}
  內容角度：{{ $json.chosen_angle }}
  Hook 策略：{{ $json.hook_strategy }}
  知識要點：{{ $json.knowledge_points }}
  爆款靈感（請重新設計，不可抄襲）：{{ $json.hook_ideas }}
  
  請依標準格式完整輸出。"

輸出處理：Code 節點解析所有欄位（同 MVP 版 M4 節點）
```

#### 節點 S9：Compliance Checker（合規審查）
```
節點類型：HTTP Request（Claude API）
Model：claude-sonnet-4-6
Max Tokens：800

Prompt：
  "你是台灣食品廣告合規審查員。
  依《食品安全衛生管理法》第28條審查以下貼文：
  
  ---
  {{ $json.copy_full }}
  ---
  
  請輸出 JSON：
  {
    'pass': true/false,
    'risk_level': 'low'/'medium'/'high',
    'flags': ['問題句子1'],
    'suggestions': ['修改建議1'],
    'auto_fixable': true/false
  }"

路由邏輯：
  risk_level = 'high' → 標記 needs_review = true，仍繼續
  pass = false → 觸發 Auto Fix 節點
  pass = true → 直接繼續
```

#### 節點 S9b：Auto Fix（自動修正，僅中低風險）
```
節點類型：HTTP Request（Claude API）
觸發條件：pass = false AND risk_level != 'high'

Prompt：
  "請修正以下貼文中的違規表達，
  將每個 flags 中的問題句子改為合規表達。
  保持品牌語氣，不改變文案主旨。
  
  原始文案：{{ $json.copy_full }}
  問題項目：{{ $json.flags }}
  修改建議：{{ $json.suggestions }}"

輸出：{ copy_full: 修正後版本, auto_fixed: true }
```

#### 節點 S10：Image Prompt Generator（圖片 Prompt 生成）
```
節點類型：HTTP Request（Claude API）
Max Tokens：600

Prompt：
  "根據以下貼文主題，生成 Midjourney / DALL-E 3 的圖片 Prompt：
  
  主題：{{ $json.topic_name }}
  圖片概念：{{ $json.image_concept }}
  品牌色：深林綠#2D5A27、金牌金#C9A84C、米白#F5F0E8
  
  要求：
  - 東方養生感 × 現代簡約 × 療癒柔和
  - 不出現文字、藥品、醫院、針頭
  - 高質感品牌視覺
  
  請輸出：
  - prompt_1_1: 方圖 1:1（以 --ar 1:1 --style raw 結尾）
  - prompt_4_5: 直式 4:5（以 --ar 4:5 --style raw 結尾）
  - negative_prompt: 排除元素"
```

#### 節點 S11：Image Generator（圖片生成）
```
節點類型：HTTP Request（OpenAI DALL-E 3）
URL：https://api.openai.com/v1/images/generations
Method：POST

Headers：
  Authorization: Bearer {{ $credentials.openAiKey }}
  Content-Type: application/json

Body：
{
  "model": "dall-e-3",
  "prompt": "{{ $json.prompt_1_1 }}",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard",
  "style": "natural"
}

輸出：{ image_url: "https://..." }

後處理：
  - 下載圖片存入 Google Drive
  - 取得永久連結
  - 更新 image_url 為 Drive 連結
```

#### 節點 S12：Layout Formatter（格式整理）
```
節點類型：Code
用途：組裝成 LINE Messaging API Flex Message 格式

程式碼輸出：
{
  "line_payload": {
    "messages": [
      {
        "type": "image",
        "originalContentUrl": "{{ image_url }}",
        "previewImageUrl": "{{ image_url }}"
      },
      {
        "type": "text", 
        "text": "{{ title }}\n\n{{ copy_full }}\n\n{{ cta }}\n\n{{ hashtags }}\n\n{{ disclaimer }}"
      }
    ]
  },
  "preview_text": "{{ title }} | {{ hook }}",
  "char_count": {{ copy_full.length }}
}
```

#### 節點 S13：Draft Saver（儲存草稿）
```
節點類型：Google Sheets（Append Row）
Sheet：Draft Posts

所有欄位（見第八章資料表設計）

同時：Notion API 建立草稿卡片（選用）
```

#### 節點 S14：Human Review Gate（人工審核閘門）
```
架構：Webhook 等待 + 超時處理

步驟 1：儲存草稿後，發送 LINE 通知給管理員
  "【新草稿待審核 #{{ draft_id }}】
  標題：{{ title }}
  風險：{{ risk_level }}
  👉 請至審核連結核准或拒絕：
  https://your-review-url/{{ draft_id }}"

步驟 2：等待審核 Webhook（n8n Webhook 節點）
  - 接收 { draft_id, action: "approve"/"reject", notes }
  - 超時設定：4 小時未回應 → 保留草稿，不發送

步驟 3：IF action = "approve" → LINE Publisher
         IF action = "reject" → Log & Archive
```

#### 節點 S15：LINE Publisher（發布）
```
節點類型：HTTP Request
URL：https://api.line.me/v2/bot/message/broadcast
Method：POST

Headers：
  Authorization: Bearer {{ LINE_CHANNEL_ACCESS_TOKEN }}
  Content-Type: application/json

Body：{{ $json.line_payload }}

成功後：
  - 更新 Google Sheets status = "published"
  - 記錄 published_at, line_message_id
```

#### 節點 S16：Log / Archive + Error Handler
```
節點類型：Google Sheets（Update Row）
更新 Published Posts 表：
  - post_id, line_message_id, published_at, status

Error Handler（全域）：
  任何節點失敗 → 
  1. 記錄錯誤到 Error Log Sheet
  2. LINE 通知管理員
  3. 設定 status = "error"
```

---

## 五、資料流總覽

```
Cron → {timestamp, hour}
  ↓
Time Slot Router → {pillar, topic_hint}
  ↓
Duplicate Checker → {is_duplicate}
  ↓
Topic Selector → {topic_id, topic_name, keywords}
  ↓
Trend Finder → {trend_sources, hook_ideas}
  ↓  [並行]
Knowledge Gatherer → {knowledge_points, safe_statements}
  ↓
Content Planner → {chosen_angle, hook_strategy, structure}
  ↓
Copy Generator → {title, hook, copy_short, copy_full, copy_card, cta, hashtags, disclaimer}
  ↓
Compliance Checker → {pass, risk_level, flags}
  ↓ [分支]
  PASS → Image Prompt Generator
  FAIL（低/中）→ Auto Fix → Image Prompt Generator
  FAIL（高）→ 標記 needs_review=true → Image Prompt Generator
  ↓
Image Prompt Generator → {prompt_1_1, prompt_4_5, negative_prompt}
  ↓
Image Generator → {image_url}
  ↓
Layout Formatter → {line_payload, preview_text}
  ↓
Draft Saver → {draft_id, status: "pending_review"}
  ↓
Human Review Gate
  ↓ approve     ↓ reject
LINE Publisher  Archive
  ↓
Log / Archive → {post_id, published_at}
```

---

## 六、Google Sheets 試算表結構

### Spreadsheet ID：（建立後填入）
### 需建立的分頁（Sheet）：

1. **Topic Library** — 主題庫
2. **Trend Sources** — 爆款靈感庫
3. **Content Queue** — 排程佇列
4. **Draft Posts** — 草稿庫
5. **Approved Posts** — 核准待發
6. **Published Posts** — 已發布紀錄
7. **Error Log** — 錯誤紀錄
8. **Compliance Rules** — 合規規則
9. **Keyword Blacklist** — 禁用詞庫
10. **Performance Dashboard** — 成效追蹤

---

## 七、n8n 環境變數設定

在 n8n 設定以下環境變數（Settings → Variables）：

```
CLAUDE_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
LINE_CHANNEL_ACCESS_TOKEN=R60cjQbVq...（你的 Token）
SERPAPI_KEY=xxxxx
GOOGLE_SPREADSHEET_ID=1pmOlxQ_CDrXejZ7JnD8X_t62JPvJY03a77E_WTibQ04
LINE_NOTIFY_TOKEN=xxxxx
NOTION_API_KEY=secret_xxxxx（選用）
REVIEW_WEBHOOK_URL=https://your-n8n-url/webhook/review
```

---

## 八、錯誤處理策略

| 錯誤類型 | 處理方式 | 通知 |
|---------|---------|------|
| Claude API 超時 | 重試 3 次，間隔 30 秒 | 3 次失敗後通知 |
| 圖片生成失敗 | 使用備用素材庫的預設圖片 | 通知人工補圖 |
| LINE 發布失敗 | 重試 2 次，記錄錯誤 | 立即通知 |
| 合規 FAIL | 自動修改（低/中風險），人工（高風險）| 視風險等級 |
| Sheets 寫入失敗 | 重試 3 次 | 失敗後通知 |

---

## 九、效能優化建議

1. **Token 優化：** System Prompt 可存入 Claude Project（節省每次輸入）
2. **圖片快取：** 同類主題可重複使用已生成圖片（加 image_cache 邏輯）
3. **批次生成：** 可改為每天一次批次生成當天所有草稿（節省 API 呼叫）
4. **Webhook 審核：** 建議用 Notion + n8n Webhook 串接，最簡單高效
5. **費用控制：** 設定月 Token 上限，超過後自動暫停

---

## 十、部署步驟（快速上手）

```
Step 1：安裝 n8n
  docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

Step 2：匯入 workflow JSON
  n8n → Workflows → Import from File → 匯入本規格書附件的 JSON

Step 3：設定 Credentials
  n8n → Settings → Credentials → 依上方清單逐一設定

Step 4：設定環境變數
  n8n → Settings → Variables → 填入所有 API Keys

Step 5：啟用 MVP 版 Workflow
  先啟用手動觸發版，測試 3-5 次確認正常

Step 6：切換標準版
  確認 MVP 版穩定後，啟用 Cron Trigger 版
```
