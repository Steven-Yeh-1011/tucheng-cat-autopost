# Render 部署指南

本專案使用 Render 平台部署，需要建立以下服務：

## 服務架構

### 1. Web Service (主要應用程式)

**服務名稱**: `tucheng-cat-backend`

**類型**: Web Service

**功能**:
- 處理 HTTP API 請求 (`/api/posts`, `/api/images`)
- 接收 LINE Webhook (`/line/webhook`)
- 提供排程任務端點 (`/api/tasks/*`)

**環境變數**:
- `DATABASE_URL`: PostgreSQL 連接字串
- `BACKEND_PORT`: 10000 (Render 自動設定)
- `FRONTEND_URL`: LIFF 前端 URL
- `LINE_CHANNEL_ACCESS_TOKEN`: LINE Bot Channel Access Token
- `LINE_CHANNEL_SECRET`: LINE Bot Channel Secret
- `LINE_USER_ID`: 您的 LINE User ID
- `OPENAI_API_KEY`: OpenAI API 金鑰
- `META_ACCESS_TOKEN`: Meta (Facebook) Access Token
- `META_PAGE_ID`: Facebook Page ID
- `META_IG_ACCOUNT_ID`: Instagram Account ID

**建置指令**:
```bash
cd apps/backend && pnpm install && pnpm prisma:generate && pnpm build
```

**啟動指令**:
```bash
cd apps/backend && pnpm start:prod
```

### 2. Cron Job (每日生成草稿)

**服務名稱**: `generate-daily-draft`

**類型**: Cron Job

**排程**: `0 9 * * *` (每天 UTC 9:00，台灣時間 17:00)

**功能**: 呼叫 Web Service 的 `/api/tasks/generate-daily-draft` 端點

**環境變數**:
- `DATABASE_URL`: 與 Web Service 相同
- `WEB_SERVICE_URL`: 自動從 Web Service 取得

### 3. Cron Job (清理圖片庫)

**服務名稱**: `cleanup-images`

**類型**: Cron Job

**排程**: `0 2 * * 0` (每週日 UTC 2:00，台灣時間 10:00)

**功能**: 呼叫 Web Service 的 `/api/tasks/cleanup-images` 端點

**環境變數**:
- `DATABASE_URL`: 與 Web Service 相同
- `WEB_SERVICE_URL`: 自動從 Web Service 取得

## 部署步驟

### 方法一：使用 render.yaml (推薦)

1. 在 Render Dashboard 選擇 "New" → "Blueprint"
2. 連接您的 GitHub 倉庫
3. Render 會自動讀取 `render.yaml` 並建立所有服務

### 方法二：手動建立服務

#### 建立 Web Service

1. 在 Render Dashboard 選擇 "New" → "Web Service"
2. 連接 GitHub 倉庫
3. 設定：
   - **Name**: `tucheng-cat-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/backend && pnpm install && pnpm prisma:generate && pnpm build`
   - **Start Command**: `cd apps/backend && pnpm start:prod`
   - **Plan**: Starter (或更高)
4. 設定環境變數（見上方列表）
5. 建立 PostgreSQL 資料庫並連接

#### 建立 Cron Jobs

1. 在 Render Dashboard 選擇 "New" → "Cron Job"
2. 連接相同的 GitHub 倉庫
3. 設定：
   - **Name**: `generate-daily-draft` 或 `cleanup-images`
   - **Schedule**: 對應的 cron 表達式
   - **Build Command**: `cd apps/backend && pnpm install && pnpm prisma:generate`
   - **Start Command**: 使用 curl 或 node 腳本呼叫 Web Service API
4. 設定環境變數（包括 `WEB_SERVICE_URL`）

## 資料庫 Migration

部署後需要執行 Migration：

```bash
# 透過 Render Shell 或 SSH
cd apps/backend
pnpm prisma migrate deploy
```

或使用 Render 的環境變數設定自動執行。

## 注意事項

1. **環境變數同步**: 使用 `sync: false` 的環境變數需要在每個服務中手動設定
2. **資料庫連接**: 確保所有服務使用相同的 `DATABASE_URL`
3. **Web Service URL**: Cron Jobs 需要知道 Web Service 的 URL，可以使用 Render 的服務引用功能
4. **LIFF URL**: 更新 LINE Developers Console 中的 LIFF URL 為實際的 Frontend URL
5. **時區**: Cron 排程使用 UTC，請根據台灣時間調整

## 監控與日誌

- 在 Render Dashboard 可以查看各服務的日誌
- Web Service 會持續運行，Cron Jobs 只在排程時間執行
- 建議設定告警通知以監控服務狀態

## 成本優化

- Web Service: 持續運行，選擇適合的 Plan
- Cron Jobs: 只在執行時計費，成本較低
- 資料庫: 可選擇 Render PostgreSQL 或外部資料庫

