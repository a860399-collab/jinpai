# 金牌一條根平台別貼文模板

- 適用品牌：金牌一條根
- LINE OA：@111wrvef
- 適用平台：Facebook、LINE 官方帳號、Instagram、Threads、TikTok、抖音
- 建議流程：AI 產生草稿 -> 法規/藥師/人工審核 -> 排程/發布
- 法規原則：不得將產品包裝成神藥；不得自動產出違規醫療宣稱；所有草稿預設為待審核。

---

## 一、共用合規底線

### 可用主軸

- 外用油膏
- 乙類成藥
- 成分透明
- 藥證可查
- 局部按摩
- 暫時舒緩
- 肌肉痠痛
- 肩頸僵硬不適
- 運動後痠痛
- 久站後小腿不適
- 久坐後腰背不適
- 輕微關節痠痛
- 依標示使用
- 若症狀持續請諮詢醫師或藥師

### 禁用主軸

- 根治、治療疾病、消炎治本
- 一擦就好、保證有效、立即見效
- 深層修復、修復軟骨、修復韌帶
- 打通經絡、活血化瘀
- 替代藥物、藥效神奇
- 治療退化性關節炎、骨刺、椎間盤突出、神經痛、風濕免疫疾病
- 鼓勵用於傷口、破皮、黏膜、眼周、熱敷、密封包紮、大面積長時間使用

### 必備免責聲明

標準版：

> 本產品為外用油膏，請依核准標示使用。本內容為一般資訊分享，非醫療診斷或治療建議；若症狀持續或惡化，請諮詢醫師或藥師。

短版：

> 外用產品請依標示使用；症狀持續或惡化請諮詢醫師或藥師。

安全提醒版：

> 僅供外用。避免接觸眼睛、黏膜、破皮或傷口；特殊族群使用前請先諮詢專業人員。

---

## 二、平台定位總表

| 平台 | 角色 | 建議形式 | 文字長度 | 圖像/影片 | CTA |
|---|---|---|---:|---|---|
| Facebook | 說明與信任建立 | 圖文、輪播、短影片 | 250-600 字 | 1 張主圖或 3-5 張輪播 | 留言、收藏、私訊 |
| LINE OA | 到點提醒與轉換 | 圖片 + 短文、Flex Message | 120-250 字 | 1 張圖卡或 1:1 圖片 | 私訊、點連結、收藏 |
| Instagram | 視覺記憶與品牌感 | Reels、Carousel、單圖 | 80-300 字 caption | 4:5 圖、Reels、輪播 | 收藏、分享、留言 |
| Threads | 對話與觀念種草 | 短文字、問答串 | 120-450 字 | 可純文字，可附 1 圖 | 回覆、轉發、追蹤 |
| TikTok | 短影音觸及 | 15-45 秒短影片 | 60-150 字標題/描述 | 9:16 影片 | 收藏、留言、看置頂 |
| 抖音 | 短影音與搜尋導流 | 15-45 秒短影片 | 60-150 字標題/描述 | 9:16 影片 | 評論、私信、看主頁 |

---

## 三、共用輸入欄位

每次產文前，請提供或從排程表讀取：

```yaml
post_id:
platform:
topic_title:
pillar_code:
pillar_name:
content_angle:
target_audience:
safe_claim_boundary:
required_warning:
risk_level:
visual_style:
cta_type:
mandatory_disclaimer:
forbidden_terms:
source_reference:
review_status: pending_legal_pharmacist_review
```

---

## 四、Facebook 貼文模板

### 適用

Facebook 適合建立信任、教育使用邊界、說明成分與情境。可比 LINE 寫得更完整，但不要寫成療效廣告。

### 格式

```text
【標題】12-18 字，避免誇大

開場 Hook：
用一個生活情境切入，不直接承諾效果。

正文：
1. 情境：誰會遇到這個問題
2. 保守說法：局部按摩、暫時舒緩、依標示使用
3. 安全邊界：哪些情況不要自行處理
4. 品牌信任：成分透明、乙類成藥、藥證可查

CTA：
留言 / 收藏 / 私訊了解依標示使用方式

免責聲明：
使用標準版或安全提醒版。

#Hashtag 3-6 個
```

### Codex 產文 Prompt

```text
請產生一則 Facebook 圖文貼文草稿。
主題：{{topic_title}}
內容支柱：{{pillar_code}} - {{pillar_name}}
受眾：{{target_audience}}
角度：{{content_angle}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}
禁用詞：{{forbidden_terms}}

要求：
1. 繁體中文，250-600 字。
2. 開場需是生活情境，不得承諾療效。
3. 必須包含「依標示使用」或同義安全語。
4. 不得使用根治、治療疾病、消炎、深層修復、一擦就好、保證有效。
5. 結尾加 CTA、免責聲明、3-6 個 hashtag。
6. 最後標示：審核狀態：待法規/藥師/人工審核。
```

---

## 五、LINE 官方帳號貼文模板

### 適用

LINE 適合短、清楚、到點提醒。不要塞太多醫學資訊；重點是「今天可以怎麼安全使用」。

### 格式

```text
【短標題】10-14 字

第一句 Hook：一句話點出生活情境

正文 120-220 字：
- 一個情境
- 一個保守建議
- 一個安全提醒

CTA：
收藏這則 / 回覆關鍵字 / 私訊了解

短版免責聲明
```

### Codex 產文 Prompt

```text
請產生一則 LINE 官方帳號 broadcast 草稿。
LINE OA：@111wrvef
主題：{{topic_title}}
受眾：{{target_audience}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}

要求：
1. 120-220 字，手機閱讀友善。
2. 最多 2 個 emoji；不得有廉價促銷感。
3. 若搭配圖片，輸出「圖卡三行文案」，總字數 30 字內。
4. 必須包含短版免責聲明。
5. 輸出 LINE message payload 所需欄位：title、text、image_card_copy、cta、disclaimer。
6. 審核狀態固定為 pending_legal_pharmacist_review。
```

---

## 六、Instagram 貼文模板

### 適用

Instagram 以視覺與收藏為主。建議優先做 Carousel 或 Reels，caption 補充安全說明。Meta Instagram Graph API caption 支援 hashtag，但仍應控制在好讀範圍。

### Carousel 格式

```text
Slide 1：主標，8-12 字
Slide 2：生活情境
Slide 3：保守知識點
Slide 4：安全提醒
Slide 5：CTA + 免責聲明短句

Caption：
80-300 字，補充「依標示使用」與安全邊界。

Hashtag：
5-10 個，以品牌、情境、保健、外用油膏為主。
```

### Codex 產文 Prompt

```text
請產生一則 Instagram Carousel 貼文草稿。
主題：{{topic_title}}
視覺風格：{{visual_style}}
受眾：{{target_audience}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}

要求：
1. 產出 5 張輪播圖的每張圖文案，每張 8-28 字。
2. Caption 80-300 字。
3. Hashtag 5-10 個，避免醫療療效暗示。
4. 加入 alt text，描述畫面，不加入療效宣稱。
5. 結尾標示待人工審核。
```

---

## 七、Threads 貼文模板

### 適用

Threads 適合口語、觀念、問答、互動，不適合長篇產品介紹。每則以一個觀念為主。

### 格式

```text
第一句：問題或反常識
第二段：保守解釋
第三段：安全邊界
CTA：你平常最常哪裡緊繃？
```

### Codex 產文 Prompt

```text
請產生一則 Threads 草稿。
主題：{{topic_title}}
角度：{{content_angle}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}

要求：
1. 120-450 字，單一觀念，口語但不浮誇。
2. 不超過 500 字。
3. 優先用問句引發回覆。
4. 不使用醫療療效承諾。
5. 若需要拆成串文，最多 2 則，每則獨立可讀。
6. 結尾標示：待人工審核。
```

---

## 八、TikTok 短影音模板

### 適用

TikTok 以 15-45 秒短影片為主，先做安全衛教與情境共鳴，不做誇大功效。TikTok Content Posting API 有「上傳到 inbox 後由使用者完成發布」的流程；若使用 Direct Post，仍需確認權限與審核。

### 影片腳本格式

```text
片長：15-45 秒
比例：9:16

0-3 秒 Hook：
一句生活情境或問題

3-15 秒 情境：
久坐、運動後、久站、長輩日常、安全提醒

15-30 秒 保守知識：
局部按摩、暫時舒緩、依標示使用

30-40 秒 安全邊界：
破皮、眼周、熱敷、症狀持續等提醒

40-45 秒 CTA：
收藏這支，使用前先看標示
```

### Codex 產文 Prompt

```text
請產生一支 TikTok 短影音腳本草稿。
主題：{{topic_title}}
受眾：{{target_audience}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}
視覺風格：{{visual_style}}

要求：
1. 15-45 秒，9:16。
2. 輸出：影片標題、畫面分鏡、旁白、字幕、鏡頭建議、封面字、描述文字、hashtag。
3. 描述文字 60-150 字。
4. 不得宣稱治療、根治、立即見效。
5. 若主題涉及安全禁忌，語氣要清楚但不恐嚇。
6. 發布狀態：待人工審核，不直接發布。
```

---

## 九、抖音短影音模板

### 適用

抖音與 TikTok 是不同平台、不同 API 與審核環境。抖音內容更要避免醫療、藥效、疾病治療暗示；建議先以「生活保養、安全使用、成分透明」為主。

### 影片腳本格式

```text
片長：15-45 秒
比例：9:16

標題：
不超過 18 字，避免功效承諾

前 3 秒：
生活痛點或提醒

中段：
一個可安全表達的外用保養觀念

結尾：
依標示使用 + 有不適請諮詢醫師或藥師
```

### Codex 產文 Prompt

```text
請產生一支抖音短影音腳本草稿。
主題：{{topic_title}}
受眾：{{target_audience}}
可用宣稱邊界：{{safe_claim_boundary}}
必備安全提醒：{{required_warning}}

要求：
1. 使用簡體中文或繁體中文版本各一版，方便後續人工選用。
2. 15-45 秒，9:16。
3. 標題、封面字、旁白、字幕、分鏡、描述文字分開輸出。
4. 禁止醫療療效、疾病治療、誇大藥效。
5. 不使用「神效」「一抹就好」「根治」「消炎」「打通經絡」。
6. 發布狀態：待人工審核。
```

---

## 十、跨平台改寫規則

同一則主題先產生「母稿」，再改寫成平台版本：

| 母稿元素 | FB | LINE | IG | Threads | TikTok | 抖音 |
|---|---|---|---|---|---|---|
| 標題 | 保留 | 縮短 | 變封面字 | 變第一句 | 變前 3 秒 Hook | 變前 3 秒 Hook |
| 正文 | 完整說明 | 壓縮 | 拆成輪播 | 口語化 | 變旁白 | 變旁白 |
| 安全提醒 | 明確段落 | 短句 | Slide 4/5 | 一句提醒 | 結尾字幕 | 結尾字幕 |
| CTA | 留言/私訊 | 私訊/收藏 | 收藏/分享 | 回覆 | 收藏/留言 | 評論/私信 |
| 圖像 | 主圖/輪播 | 圖卡 | 4:5/Carousel | 可無圖 | 9:16 影片 | 9:16 影片 |

---

## 十一、n8n 輸出 JSON Schema

```json
{
  "post_id": "LINE001",
  "platform": "facebook|line|instagram|threads|tiktok|douyin",
  "topic_title": "",
  "draft": {
    "title": "",
    "hook": "",
    "body": "",
    "cta": "",
    "hashtags": [],
    "disclaimer": ""
  },
  "visual": {
    "format": "single_image|carousel|reel|short_video|flex_message",
    "cover_text": "",
    "image_prompt": "",
    "video_script": "",
    "alt_text": ""
  },
  "compliance": {
    "risk_level": "low|medium|high",
    "forbidden_terms_found": [],
    "required_warning_included": true,
    "review_status": "pending_legal_pharmacist_review",
    "publish_allowed": false
  }
}
```

---

## 十二、人工審核清單

發布前逐項確認：

- 是否暗示治療疾病？
- 是否出現根治、消炎、一擦就好、保證有效？
- 是否誤導可用於傷口、破皮、眼周、黏膜？
- 是否鼓勵熱敷、密封包紮、大面積長時間使用？
- 是否提及兒童、孕哺、過敏、抗凝血藥時有安全提醒？
- 是否包含依標示使用、症狀持續請諮詢醫師或藥師？
- 是否平台格式正確？
- 是否圖片/影片字幕沒有比正文更誇大？

---

## 十三、參考來源

- LINE Developers Messaging API：支援 broadcast message endpoint。
- Instagram Graph API IG User Media：caption 可用於 image/video/carousel/Reels，caption 上限 2200 characters、30 hashtags、20 mentions；alt text 上限 1000 characters。
- Meta Threads 官方介紹：Threads posts up to 500 characters，支援 links、photos、videos up to 5 minutes。
- TikTok for Developers Content Posting API：支援上傳影片，使用者可能需從 inbox 完成發布流程；API 有頻率與 pending share 限制。
- 抖音開放平台：抖音與 TikTok 為不同平台，發布能力需依抖音開放平台與帳號/應用權限另外審核。

