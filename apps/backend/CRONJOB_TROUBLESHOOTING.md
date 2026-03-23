# Cronjob 失敗問題診斷指南

## 錯誤訊息
```
❌ Your cronjob failed because of an error: Exited with status 1
```

## 可能的原因

### 1. ❌ **缺少 DATABASE_URL 環境變數**（最常見）

Cronjob 需要連接資料庫，必須設定 `DATABASE_URL`。

**檢查方法：**
1. 前往 Render Dashboard
2. 選擇失敗的 Cron Job（`cleanup-images` 或 `generate-daily-draft`）
3. 進入「Environment」頁籤
4. 檢查是否有 `DATABASE_URL` 環境變數

**解決方案：**
1. 在 Render Dashboard → Cron Job → Environment 中新增：
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
2. 點擊「Save Changes」
3. 重新部署 Cron Job

### 2. ❌ **Prisma Client 未生成**

如果 Build Command 中缺少 `prisma:generate`，會導致執行時找不到 Prisma Client。

**檢查方法：**
查看 Render Dashboard → Cron Job → Settings → Build Command

**應該包含：**
```bash
cd apps/backend && npm ci --include=dev && npm run prisma:generate && npm run build
```

**解決方案：**
確保 Build Command 包含：
```bash
npm run prisma:generate
```

### 3. ❌ **建置產物不存在**

如果 `dist/scripts/run-task.js` 不存在，執行會失敗。

**檢查方法：**
Build Command 必須包含 `npm run build`

**解決方案：**
確保 Build Command 包含：
```bash
npm run build
```

### 4. ❌ **任務名稱錯誤**

如果 Start Command 中的任務名稱不正確，會導致失敗。

**檢查方法：**
- `cleanup-images` Cron Job 的 Start Command 應該是：
  ```bash
  node dist/scripts/run-task.js cleanup-images
  ```
- `generate-daily-draft` Cron Job 的 Start Command 應該是：
  ```bash
  node dist/scripts/run-task.js generate-daily-draft
  ```

### 5. ❌ **缺少 Google AI API Key（僅 generate-daily-draft）**

`generate-daily-draft` 任務需要 `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY`。

**檢查方法：**
在 Render Dashboard 檢查 `generate-daily-draft` Cron Job 的環境變數

**解決方案：**
新增環境變數：
```
GEMINI_API_KEY=your_api_key_here
```
或
```
GOOGLE_AI_API_KEY=your_api_key_here
```

## Render Cron Job 設定檢查清單

### cleanup-images Cron Job

**Build Command:**
```bash
cd apps/backend && npm ci --include=dev && npm run prisma:generate && npm run build
```

**Start Command:**
```bash
node dist/scripts/run-task.js cleanup-images
```

**環境變數（必需）：**
- ✅ `DATABASE_URL` - PostgreSQL 連線字串

**環境變數（可選）：**
- `GOOGLE_AI_API_KEY` - 不需要（此任務不使用 AI）

### generate-daily-draft Cron Job

**Build Command:**
```bash
cd apps/backend && npm ci --include=dev && npm run prisma:generate && npm run build
```

**Start Command:**
```bash
node dist/scripts/run-task.js generate-daily-draft
```

**環境變數（必需）：**
- ✅ `DATABASE_URL` - PostgreSQL 連線字串
- ✅ `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` - Google AI Studio API 金鑰

**環境變數（可選）：**
- 如果未設定 AI API Key，任務會創建 placeholder 草稿

## 快速診斷步驟

### 步驟 1：檢查環境變數

在 Render Dashboard 中確認：
- [ ] `DATABASE_URL` 已設定
- [ ] `generate-daily-draft` 需要 `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY`

### 步驟 2：檢查 Build Command

確保 Build Command 包含：
```bash
cd apps/backend && npm ci --include=dev && npm run prisma:generate && npm run build
```

### 步驟 3：檢查 Start Command

- `cleanup-images`: `node dist/scripts/run-task.js cleanup-images`
- `generate-daily-draft`: `node dist/scripts/run-task.js generate-daily-draft`

### 步驟 4：查看日誌

在 Render Dashboard → Cron Job → Logs 中查看詳細錯誤訊息：
- 如果是「缺少環境變數」，會看到明確的錯誤訊息
- 如果是「Prisma Client 未找到」，會看到模組載入錯誤
- 如果是「資料庫連線失敗」，會看到連線錯誤

## 常見錯誤訊息對照

### 錯誤 1：`Error: Cannot find module '@prisma/client'`
**原因**：Prisma Client 未生成  
**解決**：確保 Build Command 包含 `npm run prisma:generate`

### 錯誤 2：`Error: Environment variable not found: DATABASE_URL`
**原因**：缺少 DATABASE_URL  
**解決**：在 Render Dashboard 設定 DATABASE_URL 環境變數

### 錯誤 3：`Error: Can't reach database server`
**原因**：DATABASE_URL 錯誤或資料庫無法連線  
**解決**：檢查 DATABASE_URL 格式和資料庫連線設定

### 錯誤 4：`❌ 未知的任務名稱: xxx`
**原因**：Start Command 中的任務名稱錯誤  
**解決**：檢查 Start Command 是否正確

### 錯誤 5：`Cannot find module 'dist/scripts/run-task.js'`
**原因**：建置失敗或建置路徑錯誤  
**解決**：確保 Build Command 包含 `npm run build`，且執行路徑正確

## 本地測試

在本地測試 Cron Job 是否正常運作：

```bash
cd apps/backend

# 測試 cleanup-images
npm run task:cleanup-images:dev

# 測試 generate-daily-draft
npm run task:generate-daily-draft:dev
```

如果本地測試成功，問題可能出在 Render 的環境設定或建置流程。

## 聯絡支援

如果以上方法都無法解決，請提供：
1. 失敗的 Cron Job 名稱（`cleanup-images` 或 `generate-daily-draft`）
2. Render Dashboard 中的完整錯誤日誌
3. Build Command 和 Start Command 設定
4. 環境變數清單（隱藏敏感資訊）

