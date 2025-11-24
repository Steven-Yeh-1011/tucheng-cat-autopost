# Vercel 部署指南

本指南說明如何在 Vercel 部署「土城貓舍自動發文系統」的前端（LIFF Editor）和後端（可選）。

## 架構建議

### 推薦部署方式

- **前端 (LIFF Editor)**: 部署到 Vercel ✅
- **後端 (NestJS)**: 部署到 Render ✅（已設定）

### 為什麼這樣分配？

- **Vercel**: 適合 Next.js 前端，自動優化、CDN 加速
- **Render**: 適合後端 API，支援 Web Service 和 Cron Jobs

---

## 方案一：部署前端到 Vercel（推薦）

### 步驟 1: 連接 GitHub 倉庫

1. 在 Vercel Dashboard 點擊「**Add New...**」→「**Project**」
2. 選擇「**Import Git Repository**」
3. 選擇 `Steven-Yeh-1011/tucheng-cat-autopost`
4. 點擊「**Import**」

### 步驟 2: 設定專案

#### 2.1 基本設定

- **Framework Preset**: 選擇「**Next.js**」（Vercel 會自動偵測）
- **Root Directory**: 設定為 `apps/liff-editor`
  - 點擊「**Edit**」按鈕
  - 在彈出的目錄選擇器中：
    - 如果看到 `apps` 目錄，點擊展開
    - 選擇 `apps/liff-editor`
    - 如果沒有看到 `liff-editor`，請先確認 GitHub 倉庫已更新（見下方「問題排除」）
  - 點擊「**Continue**」
- **Project Name**: `tucheng-cat-liff-editor`（或您喜歡的名稱）

#### 2.2 如果看不到 liff-editor 選項

**可能原因和解決方法**：

1. **GitHub 倉庫未更新**：
   - 確認本地檔案已推送到 GitHub
   - 在 Vercel 中點擊「**Refresh**」或重新匯入倉庫

2. **手動輸入路徑**：
   - 在 Root Directory 彈窗中，如果沒有看到 `liff-editor`
   - 可以嘗試手動輸入：`apps/liff-editor`
   - 或先選擇 `apps`，然後在下一步中指定

3. **檢查 GitHub 倉庫**：
   - 前往：https://github.com/Steven-Yeh-1011/tucheng-cat-autopost/tree/main/apps
   - 確認 `liff-editor` 目錄存在
   - 如果不存在，需要先推送檔案到 GitHub

#### 2.2 Build and Output Settings

展開「**Build and Output Settings**」：

- **Build Command**: 
  ```bash
  pnpm install && pnpm build
  ```
  或使用：
  ```bash
  cd apps/liff-editor && pnpm install && pnpm build
  ```

- **Output Directory**: 
  ```
  .next
  ```
  或留空（Next.js 會自動處理）

- **Install Command**: 
  ```bash
  pnpm install
  ```

#### 2.3 Environment Variables

展開「**Environment Variables**」，新增以下環境變數：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://tucheng-cat-autopost.onrender.com` | Render 後端 URL |
| `NEXT_PUBLIC_LIFF_ID` | `您的LIFF_ID` | LINE LIFF ID |

### 步驟 3: 部署

1. 點擊「**Deploy**」按鈕
2. 等待建置完成（約 2-5 分鐘）
3. 部署完成後，Vercel 會提供一個 URL，例如：
   ```
   https://tucheng-cat-liff-editor.vercel.app
   ```

### 步驟 4: 設定自訂網域（可選）

1. 在專案設定中，前往「**Settings**」→「**Domains**」
2. 新增您的自訂網域
3. 按照指示設定 DNS

---

## 方案二：部署後端到 Vercel（不推薦，但可行）

⚠️ **注意**: 後端建議使用 Render，因為需要：
- 持續運行的 Web Service
- Cron Jobs 支援
- 更好的後端服務支援

如果仍想部署到 Vercel：

### 步驟 1: 設定專案

- **Framework Preset**: 選擇「**NestJS**」
- **Root Directory**: `apps/backend`
- **Project Name**: `tucheng-cat-autopost-backend`

### 步驟 2: Build Settings

- **Build Command**: 
  ```bash
  cd apps/backend && pnpm install && pnpm prisma:generate && pnpm build
  ```

- **Output Directory**: 
  ```
  apps/backend/dist
  ```

- **Install Command**: 
  ```bash
  pnpm install
  ```

### 步驟 3: 設定環境變數

新增所有後端需要的環境變數（參考 `RENDER_MANUAL_SETUP.md`）

### 步驟 4: 設定 Serverless Functions

Vercel 會自動將 NestJS 轉換為 Serverless Functions，但需要注意：
- 資料庫連接可能需要調整
- Cron Jobs 需要使用 Vercel Cron Jobs（付費功能）
- 某些功能可能需要額外設定

---

## 當前您看到的設定

根據您看到的畫面，您正在設定：

- **Repository**: `Steven-Yeh-1011/tucheng-cat-autopost` ✅
- **Branch**: `main` ✅
- **Path**: `apps/backend` ⚠️
- **Framework Preset**: `NestJS` ⚠️
- **Project Name**: `tucheng-cat-autopost-backend` ⚠️

### 建議調整

如果您要部署**前端**（LIFF Editor）：

1. **修改 Root Directory**：
   - 點擊「**Edit**」按鈕
   - 改為：`apps/liff-editor`

2. **修改 Framework Preset**：
   - 選擇「**Next.js**」

3. **修改 Project Name**：
   - 改為：`tucheng-cat-liff-editor`

如果您要部署**後端**（不推薦）：

1. 保持當前設定
2. 展開「**Build and Output Settings**」
3. 設定 Build Command（見上方）

---

## 環境變數設定詳情

### 前端環境變數（LIFF Editor）

在 Vercel 專案設定中，前往「**Settings**」→「**Environment Variables**」：

```env
NEXT_PUBLIC_BACKEND_URL=https://tucheng-cat-autopost.onrender.com
NEXT_PUBLIC_LIFF_ID=your-liff-id-here
```

### 後端環境變數（如果部署到 Vercel）

```env
DATABASE_URL=postgresql://...
BACKEND_PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
LINE_CHANNEL_ACCESS_TOKEN=...
LINE_CHANNEL_SECRET=...
LINE_USER_ID=...
OPENAI_API_KEY=...
META_ACCESS_TOKEN=...
META_PAGE_ID=...
META_IG_ACCOUNT_ID=...
```

---

## 部署後續步驟

### 1. 取得部署 URL

部署完成後，Vercel 會提供：
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: 每個分支都有預覽 URL

### 2. 更新 LINE LIFF URL

1. 前往 LINE Developers Console
2. 找到您的 LIFF App
3. 更新 LIFF URL 為 Vercel 提供的 URL：
   ```
   https://your-project.vercel.app/editor/{postId}
   ```

### 3. 更新後端環境變數

在 Render 後端中，更新 `FRONTEND_URL`：
```
FRONTEND_URL=https://your-project.vercel.app
```

---

## Vercel 特定設定

### Monorepo 設定

如果 Vercel 無法正確偵測 monorepo：

1. 在專案根目錄建立 `vercel.json`：

```json
{
  "buildCommand": "cd apps/liff-editor && pnpm install && pnpm build",
  "outputDirectory": "apps/liff-editor/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

2. 或使用 Vercel 的 Build Settings 手動設定

### 環境變數優先順序

Vercel 的環境變數優先順序：
1. Production
2. Preview
3. Development

確保在正確的環境中設定變數。

---

## 常見問題

### Q: Vercel 無法找到 package.json？

A: 
- 確認 Root Directory 設定正確
- 對於前端：`apps/liff-editor`
- 對於後端：`apps/backend`

### Q: 建置失敗？

A: 檢查：
1. Build Command 是否正確
2. 是否安裝了所有依賴
3. 環境變數是否設定
4. 查看建置日誌中的錯誤訊息

### Q: 如何部署多個應用（前端和後端）？

A: 
- 建立兩個 Vercel 專案
- 一個設定 Root Directory 為 `apps/liff-editor`
- 另一個設定 Root Directory 為 `apps/backend`
- 或使用 Vercel 的 Monorepo 功能

### Q: 後端在 Vercel 上可以運行 Cron Jobs 嗎？

A: 
- Vercel 有 Cron Jobs 功能，但需要 Pro 計劃
- **建議**: 使用 Render 的 Cron Jobs（更適合後端）

---

## 推薦配置總結

### 前端（Vercel）

```
Repository: Steven-Yeh-1011/tucheng-cat-autopost
Branch: main
Root Directory: apps/liff-editor
Framework: Next.js
Build Command: (自動)
Output Directory: .next
```

### 後端（Render）

```
已在 RENDER_MANUAL_SETUP.md 中說明
```

---

## 下一步

1. ✅ 完成 Vercel 專案設定
2. ✅ 設定環境變數
3. ✅ 點擊「Deploy」開始部署
4. ✅ 取得部署 URL
5. ✅ 更新 LINE LIFF URL
6. ✅ 更新 Render 後端的 FRONTEND_URL

部署完成後，您的系統就可以運作了！

