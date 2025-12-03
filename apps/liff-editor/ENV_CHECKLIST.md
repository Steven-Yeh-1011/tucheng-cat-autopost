# LIFF Dashboard 環境變數檢查清單

## Vercel 環境變數（必需）

### 前端 LIFF 應用需要的環境變數

在 **Vercel Dashboard** → **Project Settings** → **Environment Variables** 中設定：

#### 1. `NEXT_PUBLIC_BACKEND_URL` ⚠️ **必需**
```
https://tucheng-cat-autopost-backend.onrender.com
```
- **用途**：LIFF 應用連接後端 API
- **影響**：如果未設定，Dashboard 和其他頁面無法與後端通訊
- **檢查方式**：在 Dashboard 頁面打開瀏覽器 Console，應該不會看到 "後端服務未設定" 的錯誤

#### 2. `NEXT_PUBLIC_META_AUTH_URL`（可選）
```
https://tucheng-cat-autopost-backend.onrender.com/meta/callback
```
- **用途**：Meta 授權回調 URL

#### 3. `NEXT_PUBLIC_LINE_AUTH_URL`（可選）
```
https://tucheng-cat-autopost-backend.onrender.com/line/webhook
```
- **用途**：LINE 授權回調 URL

## Render 環境變數（後端）

### 後端服務需要的環境變數

在 **Render Dashboard** → **tucheng-cat-autopost-backend** → **Environment** 中設定：

#### 1. `DATABASE_URL` ⚠️ **必需**
```
postgresql://user:password@host:port/database
```

#### 2. `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY` ⚠️ **必需**
```
your_google_ai_api_key_here
```

#### 3. `LIFF_URL` ⚠️ **推薦**
```
https://liff.line.me/2008612222-PgzW5BGy
```
- **用途**：Rich Menu 按鈕的 URI 設定
- **注意**：這是完整的 LINE LIFF URL，不是 Vercel 部署網址

#### 4. `LINE_CHANNEL_ACCESS_TOKEN`（可選，用於 Rich Menu 部署）
```
your_line_channel_access_token_here
```

#### 5. Vercel 模擬變數（參考 specify.md）
```
VERCEL=1
VERCEL_ENV=production
VERCEL_REGION=iad1
VERCEL_URL=tucheng-cat-autopost-backend.onrender.com
VERCEL_PROJECT_PRODUCTION_URL=tucheng-cat-autopost-liff-editor.vercel.app
```

## 檢查步驟

### 1. 檢查 Vercel 環境變數

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇 `tucheng-cat-autopost-liff-editor` 專案
3. 進入 **Settings** → **Environment Variables**
4. 確認以下變數已設定：
   - ✅ `NEXT_PUBLIC_BACKEND_URL`
   - ⚠️ `NEXT_PUBLIC_META_AUTH_URL`（可選）
   - ⚠️ `NEXT_PUBLIC_LINE_AUTH_URL`（可選）

### 2. 檢查 Render 環境變數

1. 前往 [Render Dashboard](https://dashboard.render.com)
2. 選擇 `tucheng-cat-autopost-backend` 服務
3. 進入 **Environment** 標籤
4. 確認以下變數已設定：
   - ✅ `DATABASE_URL`
   - ✅ `GEMINI_API_KEY` 或 `GOOGLE_AI_API_KEY`
   - ⚠️ `LIFF_URL`（推薦）
   - ⚠️ `LINE_CHANNEL_ACCESS_TOKEN`（可選）

### 3. 檢查部署狀態

#### Vercel
1. 確認最新部署是否成功
2. 檢查部署日誌是否有錯誤
3. 確認環境變數是否正確注入（在部署日誌中查看）

#### Render
1. 確認後端服務是否運行中
2. 檢查日誌是否有錯誤
3. 測試後端 API 是否可訪問：
   ```
   https://tucheng-cat-autopost-backend.onrender.com/health
   ```

### 4. 測試 Dashboard

1. **直接訪問 Dashboard**：
   ```
   https://your-liff-app.vercel.app/dashboard
   ```
   - 如果可以直接訪問，說明頁面本身沒問題
   - 如果無法訪問，檢查 Vercel 部署狀態

2. **在 LINE 中測試**：
   - 打開 LINE 應用
   - 進入官方帳號
   - 點擊 LIFF 連結或 Rich Menu 按鈕
   - 應該自動重定向到 Dashboard

3. **檢查瀏覽器 Console**：
   - 打開瀏覽器開發者工具（F12）
   - 查看 Console 是否有錯誤
   - 查看 Network 標籤，確認 API 請求是否成功

## 常見問題

### Q: Dashboard 顯示但無法載入資料？

**A:** 檢查 `NEXT_PUBLIC_BACKEND_URL` 是否正確設定，以及後端服務是否正常運行。

### Q: 在 LINE 中打開 LIFF 沒有自動重定向到 Dashboard？

**A:** 
1. 檢查 Middleware 是否正確部署
2. 檢查 User Agent 檢測是否正常
3. 嘗試直接訪問 `/dashboard` 路徑

### Q: 後端 API 請求失敗？

**A:**
1. 檢查 `NEXT_PUBLIC_BACKEND_URL` 是否正確
2. 檢查後端服務是否運行中
3. 檢查 CORS 設定（如果有的話）

### Q: Rich Menu 按鈕無法跳轉？

**A:**
1. 檢查 `LIFF_URL` 是否正確設定
2. 確認 LIFF URL 格式正確：`https://liff.line.me/2008612222-PgzW5BGy`
3. 檢查 Rich Menu 是否正確部署

## 調試工具

在 Dashboard 頁面添加以下代碼來調試：

```typescript
// apps/liff-editor/app/dashboard/page.tsx
useEffect(() => {
  console.log('=== Dashboard Debug Info ===');
  console.log('User Agent:', navigator.userAgent);
  console.log('Current URL:', window.location.href);
  console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
  console.log('Is in LINE:', 
    navigator.userAgent.includes('Line') || 
    navigator.userAgent.includes('LINE') ||
    window.location.href.includes('liff.line.me')
  );
}, []);
```

## 快速檢查命令

### 檢查 Vercel 環境變數（使用 Vercel CLI）
```bash
vercel env ls
```

### 檢查後端 API 是否可訪問
```bash
curl https://tucheng-cat-autopost-backend.onrender.com/health
```

### 檢查 LIFF URL 是否正確
```bash
curl -I https://liff.line.me/2008612222-PgzW5BGy
```

