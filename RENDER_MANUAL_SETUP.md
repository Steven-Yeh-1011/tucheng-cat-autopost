# Render 手動部署指南

如果看不到 Blueprint 選項，請按照以下步驟手動建立服務。

## 步驟 1: 建立 Web Service（主要應用程式）

### 1.1 建立服務

1. 在 Render Dashboard 點擊 **"New Web Service"**
2. 連接您的 GitHub 倉庫：
   - 選擇 **"Connect account"** 或 **"Connect repository"**
   - 選擇 `Steven-Yeh-1011/tucheng-cat-autopost`
   - 選擇 `main` 分支

### 1.2 基本設定

- **Name**: `tucheng-cat-backend`
- **Region**: `Oregon`（或選擇離您最近的區域）
- **Branch**: `main`
- **Root Directory**: 留空（使用根目錄）
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  cd apps/backend && pnpm install && pnpm prisma:generate && pnpm build
  ```
- **Start Command**: 
  ```bash
  cd apps/backend && pnpm start:prod
  ```
- **Plan**: `Starter`（或根據需求選擇更高計劃）

### 1.3 環境變數設定

在 **Environment** 區塊添加以下環境變數：

| Key | Value | 說明 |
|-----|-------|------|
| `NODE_ENV` | `production` | 環境模式 |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL 連接字串（先建立資料庫，見下方） |
| `BACKEND_PORT` | `10000` | Render 自動設定，但可明確指定 |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | LIFF 前端 URL（稍後設定） |
| `LINE_CHANNEL_ACCESS_TOKEN` | `your-token` | LINE Bot Channel Access Token |
| `LINE_CHANNEL_SECRET` | `your-secret` | LINE Bot Channel Secret |
| `LINE_USER_ID` | `your-user-id` | 您的 LINE User ID |
| `OPENAI_API_KEY` | `your-key` | OpenAI API 金鑰 |
| `META_ACCESS_TOKEN` | `your-token` | Meta (Facebook) Access Token |
| `META_PAGE_ID` | `your-page-id` | Facebook Page ID |
| `META_IG_ACCOUNT_ID` | `your-ig-id` | Instagram Account ID |

### 1.4 建立並部署

點擊 **"Create Web Service"**，Render 會開始建置和部署。

---

## 步驟 2: 建立 PostgreSQL 資料庫

### 2.1 建立資料庫

1. 在 Render Dashboard 點擊 **"New Postgres"**
2. 設定：
   - **Name**: `tucheng-cat-db`
   - **Database**: `tucheng_cat_autopost`
   - **User**: `tucheng_cat_user`（或使用預設）
   - **Region**: 與 Web Service 相同
   - **Plan**: `Free` 或 `Starter`（根據需求）

### 2.2 取得連接字串

建立後，在資料庫頁面的 **"Connections"** 區塊複製 **"Internal Database URL"**，並更新到 Web Service 的 `DATABASE_URL` 環境變數。

### 2.3 執行 Migration

在 Web Service 部署後，透過 **Shell** 執行：

```bash
cd apps/backend
pnpm prisma migrate deploy
```

或使用 Render 的 **Shell** 功能執行。

---

## 步驟 3: 建立 Cron Job - 每日生成草稿

### 3.1 建立 Cron Job

1. 在 Render Dashboard 點擊 **"New Cron Job"**
2. 連接相同的 GitHub 倉庫：
   - 選擇 `Steven-Yeh-1011/tucheng-cat-autopost`
   - 選擇 `main` 分支

### 3.2 基本設定

- **Name**: `generate-daily-draft`
- **Region**: 與 Web Service 相同
- **Schedule**: `0 9 * * *`（每天 UTC 9:00，台灣時間 17:00）
- **Branch**: `main`
- **Root Directory**: 留空
- **Build Command**: 
  ```bash
  cd apps/backend && pnpm install && pnpm prisma:generate
  ```
- **Start Command**: 
  ```bash
  curl -X POST https://your-web-service.onrender.com/api/tasks/generate-daily-draft
  ```
  ⚠️ **注意**: 將 `your-web-service.onrender.com` 替換為實際的 Web Service URL

### 3.3 環境變數

- `NODE_ENV`: `production`
- `DATABASE_URL`: 與 Web Service 相同（從資料庫取得）

### 3.4 建立並部署

點擊 **"Create Cron Job"**

---

## 步驟 4: 建立 Cron Job - 清理圖片庫

### 4.1 建立 Cron Job

1. 在 Render Dashboard 點擊 **"New Cron Job"**
2. 連接相同的 GitHub 倉庫

### 4.2 基本設定

- **Name**: `cleanup-images`
- **Region**: 與 Web Service 相同
- **Schedule**: `0 2 * * 0`（每週日 UTC 2:00，台灣時間 10:00）
- **Branch**: `main`
- **Root Directory**: 留空
- **Build Command**: 
  ```bash
  cd apps/backend && pnpm install && pnpm prisma:generate
  ```
- **Start Command**: 
  ```bash
  curl -X GET https://your-web-service.onrender.com/api/tasks/cleanup-images
  ```
  ⚠️ **注意**: 將 `your-web-service.onrender.com` 替換為實際的 Web Service URL

### 4.3 環境變數

- `NODE_ENV`: `production`
- `DATABASE_URL`: 與 Web Service 相同

### 4.4 建立並部署

點擊 **"Create Cron Job"**

---

## 步驟 5: 驗證部署

### 5.1 檢查 Web Service

1. 等待建置完成（約 5-10 分鐘）
2. 檢查日誌確認沒有錯誤
3. 測試 API 端點：
   ```bash
   curl https://your-web-service.onrender.com/api/posts
   ```

### 5.2 檢查資料庫

1. 確認 Migration 已執行
2. 使用 Prisma Studio 或資料庫工具連接檢查

### 5.3 測試 Cron Jobs

1. 在 Render Dashboard 手動觸發 Cron Job
2. 查看執行日誌確認是否成功

---

## 重要提醒

1. **Web Service URL**: 建立後記下 URL，用於：
   - 更新 Cron Jobs 的 `Start Command`
   - 設定 LINE Webhook URL
   - 設定 `FRONTEND_URL` 環境變數

2. **環境變數同步**: 確保所有服務使用相同的 `DATABASE_URL`

3. **時區調整**: Cron 排程使用 UTC，請根據台灣時間調整：
   - 台灣時間 = UTC + 8
   - 例如：台灣時間 17:00 = UTC 9:00

4. **費用**: 
   - Free Plan 有使用限制
   - 建議監控使用量

---

## 故障排除

### 建置失敗

- 檢查 `Build Command` 是否正確
- 查看建置日誌中的錯誤訊息
- 確認 `package.json` 中的腳本名稱正確

### 連接資料庫失敗

- 確認 `DATABASE_URL` 使用 **Internal Database URL**（不是 External）
- 檢查資料庫是否已啟動

### Cron Job 未執行

- 檢查 `Start Command` 中的 URL 是否正確
- 確認 Web Service 已成功部署
- 查看 Cron Job 的執行日誌

---

## 完成後

部署完成後，您可以：

1. 設定 LINE Webhook URL 為：`https://your-web-service.onrender.com/line/webhook`
2. 更新 LIFF URL 到 LINE Developers Console
3. 開始使用系統！

