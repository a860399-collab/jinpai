# n8n 部署步驟｜金太極 LINE Bot
> 預計時間：30～45 分鐘｜費用：免費（Railway 每月 $5 免費額度）

---

## 準備清單

部署前先把這些帳號開好：

| 服務 | 用途 | 網址 |
|------|------|------|
| GitHub | 存放 n8n 設定 | https://github.com |
| Railway | 免費雲端主機跑 n8n | https://railway.app |
| LINE Developers | 拿 Token | https://developers.line.biz |
| Google Cloud | Sheets 讀寫權限 | https://console.cloud.google.com |
| OpenAI | 語音辨識 API | https://platform.openai.com |

---

## 第一步：取得 LINE Token（5 分鐘）

1. 登入 [LINE Developers](https://developers.line.biz)
2. 點你的 Provider → 點你的 Channel（@111wrvef 那個）
3. 點上方 **Messaging API** 頁籤
4. 往下找 **Channel access token** → 點 **Issue** → 複製保存

   ```
   LINE_CHANNEL_ACCESS_TOKEN = eyJ0eXAiOiJKV1Q...（很長的字串）
   ```

5. 點上方 **Basic settings** 頁籤
6. 往下找 **Channel secret** → 複製保存

   ```
   LINE_CHANNEL_SECRET = a1b2c3d4e5f6...（32碼）
   ```

7. **取得你自己的 LINE User ID：**
   - 在同一頁面，找 **Your user ID** → 複製
   ```
   OWNER_LINE_USER_ID = Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 第二步：建立 Google Sheets 訂單表（5 分鐘）

1. 開新的 [Google Sheets](https://sheets.google.com)
2. 命名為「**金太極訂單管理**」
3. 第一張工作表重命名為「**訂單**」
4. **第一列填入欄位名稱**（A1 開始，依序填入）：

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | 訂單編號 | 姓名 | 手機 | 地址 | 方案 | 金額 | 狀態 | LINE用戶ID | 建立時間 |

5. 從網址列複製 Sheets ID：
   ```
   https://docs.google.com/spreadsheets/d/【這一段就是ID】/edit
   ```
   ```
   GOOGLE_SHEET_ID = 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms（範例）
   ```

---

## 第三步：建立 Google Service Account（10 分鐘）

> 讓 n8n 有權限寫入你的 Google Sheets

1. 進入 [Google Cloud Console](https://console.cloud.google.com)
2. 建立新專案，命名「**jinpai-bot**」
3. 左側選單 → **APIs & Services** → **Enable APIs**
4. 搜尋 **Google Sheets API** → 點 Enable
5. 回到左側 → **APIs & Services** → **Credentials**
6. 點 **+ Create Credentials** → **Service Account**
7. 名稱填「**n8n-bot**」→ 點建立並繼續 → 完成
8. 點剛建立的 Service Account → 點 **Keys** 頁籤
9. **Add Key** → **Create new key** → **JSON** → 下載 JSON 檔
10. 打開 JSON 檔，複製 **client_email** 的值：
    ```
    n8n-bot@jinpai-bot.iam.gserviceaccount.com
    ```
11. **回到 Google Sheets** → 右上角「分享」→ 貼上上面的 email → 給「**編輯者**」權限

---

## 第四步：取得 OpenAI API Key（3 分鐘）

1. 登入 [OpenAI Platform](https://platform.openai.com)
2. 左側 **API Keys** → **Create new secret key**
3. 名稱填「jinpai-whisper」→ 複製保存

   ```
   OPENAI_API_KEY = sk-proj-xxxxxxxxxxxx
   ```

> 💡 語音辨識費用：每分鐘約 $0.006 USD，100 筆訂單語音不到 $1

---

## 第五步：用 Railway 部署 n8n（10 分鐘）

1. 登入 [Railway](https://railway.app)（用 GitHub 帳號登入最快）

2. 點 **New Project** → **Deploy from Template**

3. 搜尋 **n8n** → 選官方 n8n template → 點 **Deploy**

4. 等待部署完成（約 2 分鐘），看到綠燈表示成功

5. 點 n8n 服務 → **Variables** 頁籤 → 新增以下環境變數：

   | 變數名稱 | 值 |
   |---------|-----|
   | `N8N_BASIC_AUTH_ACTIVE` | `true` |
   | `N8N_BASIC_AUTH_USER` | `admin`（自訂帳號）|
   | `N8N_BASIC_AUTH_PASSWORD` | 設一個強密碼 |
   | `N8N_HOST` | 等下一步取得 |
   | `WEBHOOK_URL` | 等下一步取得 |
   | `LINE_CHANNEL_ACCESS_TOKEN` | 第一步取得的值 |
   | `LINE_CHANNEL_SECRET` | 第一步取得的值 |
   | `OWNER_LINE_USER_ID` | 第一步取得的值 |
   | `GOOGLE_SHEET_ID` | 第二步取得的值 |
   | `OPENAI_API_KEY` | 第四步取得的值 |

6. 點 **Settings** 頁籤 → **Domains** → **Generate Domain**
   取得你的網址，例如：
   ```
   https://n8n-production-xxxx.up.railway.app
   ```

7. 回到 **Variables** 補填：
   ```
   N8N_HOST = n8n-production-xxxx.up.railway.app
   WEBHOOK_URL = https://n8n-production-xxxx.up.railway.app
   ```

8. 點 **Redeploy** 讓設定生效

---

## 第六步：匯入 Workflow（5 分鐘）

1. 瀏覽器開啟你的 n8n 網址，用剛才設的帳號密碼登入

2. 點左側 **Workflows** → 右上角 **⋮** → **Import from file**

3. 選擇 `n8n_workflow_金太極.json` 上傳

4. 設定 Google Sheets 認證：
   - 點「寫入 Google Sheets」節點
   - 點 **Credential** → **Create New**
   - 選 **Service Account**
   - 貼上第三步下載的 JSON 檔內容

5. 點右上角 **Activate**（開關變綠色）

---

## 第七步：設定 LINE Webhook（3 分鐘）

1. 回到 [LINE Developers](https://developers.line.biz)
2. 選你的 Channel → **Messaging API** 頁籤
3. 找 **Webhook URL** → 點 **Edit**
4. 填入：
   ```
   https://n8n-production-xxxx.up.railway.app/webhook/line-webhook
   ```
5. 點 **Verify** → 看到「Success」表示連線成功 ✅
6. 開啟 **Use webhook** 開關

---

## 第八步：測試（5 分鐘）

1. 用手機掃描你的 LINE OA QR Code 加入
2. 傳訊息「訂購」
3. 確認 Bot 是否回覆選擇方案

**確認清單：**
- [ ] Bot 回覆歡迎訊息
- [ ] 點選方案後逐步收集資料
- [ ] 語音訊息被正確辨識
- [ ] 確認訂單後 Google Sheets 新增一列
- [ ] 你的 LINE 收到新訂單通知

---

## 常見問題

**Q：Verify 失敗，出現 「The webhook returned an invalid HTTP status code」**
→ 確認 n8n 的 Workflow 已經 Activate（綠色開關），並重新 Redeploy

**Q：Google Sheets 寫不進去**
→ 確認 Service Account 的 email 已被加入 Sheets 共享編輯權限

**Q：語音辨識沒反應**
→ 先確認 OPENAI_API_KEY 是否正確，OpenAI 帳號是否有餘額（需先加值 $5）

**Q：Railway 免費額度用完怎麼辦**
→ Railway 每月有 $5 免費，n8n 輕量使用約可跑 1-2 個月；也可改用 [Render](https://render.com) 免費方案（較慢但完全免費）

---

## 費用總結

| 服務 | 費用 |
|------|------|
| Railway（n8n 主機） | 免費 $5/月額度，輕量使用足夠 |
| Google Sheets | 完全免費 |
| LINE OA | 免費方案每月 200 則推播，回覆無限制 |
| OpenAI Whisper | 每筆語音訂單約 $0.01 USD，幾乎可忽略 |
| **合計** | **每月接近 $0** |
