# Render 環境變數設定指南

根據 `specify.md` 的架構定義，Render 上需要部署三個服務。以下是各服務的環境變數設定需求。

## Render 服務清單

| 服務名稱 | 類型 | 功能 | 需要 Google AI API Key |
|---------|------|------|----------------------|
| `tucheng-cat-autopost-backend` | Web Service | NestJS API / Webhook 服務 | ✅ **需要** |
| `cleanup-images` | Cron Job | 清理圖片任務 | ❌ 不需要 |
| `generate-daily-draft` | Cron Job | 每日草稿生成任務 | ✅ **需要** |

## 環境變數設定

### 1. `tucheng-cat-autopost-backend` (Web Service)

**必要環境變數：**
- `DATABASE_URL` - PostgreSQL 連線字串（必要）
- `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` - Google AI Studio API 金鑰（用於前端觸發草稿生成）

**Vercel 模擬變數（參考 specify.md）：**
- `VERCEL` = `1`
- `VERCEL_ENV` = `production`
- `VERCEL_REGION` = `iad1` (或接近 Render Region 的值)
- `VERCEL_URL` = `tucheng-cat-autopost-backend.onrender.com`
- `VERCEL_GIT_COMMIT_SHA` = (使用 `SOURCE_VERSION` 或手動填寫)
- `VERCEL_GIT_COMMIT_REF` = `main`
- `VERCEL_GIT_COMMIT_MESSAGE` = (最新 commit 訊息)
- `VERCEL_GIT_PROVIDER` = `github`
- `VERCEL_PROJECT_PRODUCTION_URL` = `tucheng-cat-autopost-liff-editor.vercel.app`

**其他可能需要的變數：**
- `PORT` - 服務端口（Render 通常自動設定）
- Meta/LINE 相關的認證變數（如果已實作）

---

### 2. `cleanup-images` (Cron Job)

**必要環境變數：**
- `DATABASE_URL` - PostgreSQL 連線字串（必要）

**不需要：**
- ❌ `GEMINI_API_KEY` / `GOOGLE_AI_API_KEY` - 此任務不使用 AI 服務

**其他可能需要的變數：**
- 圖片儲存相關的環境變數（如果已實作）

---

### 3. `generate-daily-draft` (Cron Job)

**必要環境變數：**
- `DATABASE_URL` - PostgreSQL 連線字串（必要）
- `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` - Google AI Studio API 金鑰（**必要**，用於生成草稿）

**不需要：**
- ❌ Vercel 相關變數（Cron Job 不需要）

---

## 設定步驟

### 在 Render Dashboard 設定環境變數

1. **進入 Render Dashboard**
   - 前往 https://dashboard.render.com
   - 選擇對應的服務

2. **設定環境變數**
   - 點擊服務名稱進入詳細頁面
   - 左側選單選擇「Environment」
   - 點擊「Add Environment Variable」
   - 輸入 Key 和 Value
   - 點擊「Save Changes」

3. **重新部署**
   - 設定完成後，Render 會自動觸發重新部署
   - 或手動點擊「Manual Deploy」→「Deploy latest commit」

### Google AI Studio API 金鑰取得方式

1. 前往 [Google AI Studio](https://aistudio.google.com)
2. 使用 Google 帳戶登入
3. 點擊「Get API Key」或「建立 API 金鑰」
4. 複製生成的 API 金鑰
5. 在 Render 服務中設定為 `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY`

---

## 驗證檢查清單

### ✅ 所有服務都需要
- [ ] `DATABASE_URL` 已設定且格式正確（`postgresql://` 或 `postgres://` 開頭）

### ✅ Web Service (`tucheng-cat-autopost-backend`)
- [ ] `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` 已設定
- [ ] Vercel 相關變數已設定（如果需要）

### ✅ Cron Job (`generate-daily-draft`)
- [ ] `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` 已設定

### ✅ Cron Job (`cleanup-images`)
- [ ] 不需要額外設定（只需要 `DATABASE_URL`）

---

## 注意事項

1. **API 金鑰安全**：
   - 不要在程式碼中硬編碼 API 金鑰
   - 使用環境變數管理
   - 定期輪換 API 金鑰

2. **Fallback 機制**：
   - 如果未設定 `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY`，服務會使用 placeholder 內容
   - 不會導致服務崩潰，但會記錄警告日誌

3. **環境變數命名**：
   - 支援 `GEMINI_API_KEY`（符合指南）和 `GOOGLE_AI_API_KEY`（向後相容）
   - 建議使用 `GEMINI_API_KEY` 以符合 Google AI Studio 的命名慣例

---

## 相關文件

- 架構定義：`specify.md` 第 0 章節
- 環境變數驗證：`apps/backend/src/main.ts`
- Google AI 服務實作：`apps/backend/src/openai/openai.service.ts`

