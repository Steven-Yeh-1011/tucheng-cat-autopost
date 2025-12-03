# LINE Rich Menu 自動生成與部署工具

## 概述

這個工具使用 Puppeteer 自動生成 Rich Menu 圖片，並透過 LINE Bot SDK 自動部署到 LINE 官方帳號。

## 功能特點

- ✅ **CSS 繪圖**：使用 HTML + CSS 設計 Rich Menu，無需 Photoshop
- ✅ **自動截圖**：使用 Puppeteer 渲染並截圖為 PNG
- ✅ **自動計算座標**：根據 Grid 佈局自動計算按鈕座標
- ✅ **一鍵部署**：自動建立 Rich Menu、上傳圖片、設定為預設

## 安裝依賴

```bash
cd apps/backend
npm install puppeteer @line/bot-sdk dotenv
```

## 環境變數設定

在 `.env` 檔案中設定以下環境變數：

```env
# LINE Channel Access Token（必需）
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here

# LIFF URL（推薦，完整的 LIFF URL，例如：https://liff.line.me/2008612222-PgzW5BGy）
LIFF_URL=https://liff.line.me/2008612222-PgzW5BGy

# 或使用 LIFF Base URL（可選，用於設定按鈕的 URI，例如：https://your-liff-app.vercel.app）
LIFF_BASE_URL=https://your-liff-app.vercel.app
# 或
VERCEL_PROJECT_PRODUCTION_URL=https://your-liff-app.vercel.app
```

**注意**：`LIFF_URL` 是完整的 LINE LIFF URL（例如：`https://liff.line.me/2008612222-PgzW5BGy`），而 `LIFF_BASE_URL` 是您的 Vercel 部署網址。如果設定了 `LIFF_URL`，系統會優先使用它。

## 使用方法

### 開發環境

```bash
cd apps/backend
npm run rich-menu:generate
```

### 生產環境（需要先編譯）

```bash
cd apps/backend
npm run build
npm run rich-menu:generate:prod
```

## 工作流程

1. **生成 HTML**：根據 `BUTTON_CONFIG` 配置生成 HTML 頁面
2. **渲染截圖**：使用 Puppeteer 載入 HTML 並截圖為 `rich-menu-dashboard.png`
3. **計算座標**：根據 3列 x 2行 的 Grid 佈局自動計算按鈕座標
4. **建立 Rich Menu**：呼叫 LINE API 建立 Rich Menu
5. **上傳圖片**：上傳生成的 PNG 圖片
6. **設定預設**：將 Rich Menu 設定為預設選單

## 自訂配置

編輯 `apps/backend/scripts/generate-rich-menu.ts` 中的 `BUTTON_CONFIG` 來修改按鈕：

```typescript
const BUTTON_CONFIG = [
  { id: 'editor', label: '編輯器', icon: '✏️', color: '#4F46E5', uri: '/editor' },
  { id: 'view-drafts', label: '查看草稿', icon: '📋', color: '#10B981', uri: '/drafts' },
  // ... 更多按鈕
];
```

### 修改文字

只需修改 `label` 欄位，重新執行腳本即可：

```typescript
{ id: 'editor', label: '貼文編輯', icon: '✏️', color: '#4F46E5', uri: '/editor' },
```

### 修改顏色

修改 `color` 欄位：

```typescript
{ id: 'editor', label: '編輯器', icon: '✏️', color: '#FF6B6B', uri: '/editor' },
```

### 修改圖示

修改 `icon` 欄位（支援 Emoji）：

```typescript
{ id: 'editor', label: '編輯器', icon: '🎨', color: '#4F46E5', uri: '/editor' },
```

### 修改 URI

修改 `uri` 欄位：

```typescript
{ id: 'editor', label: '編輯器', icon: '✏️', color: '#4F46E5', uri: '/posts/editor' },
```

## 輸出檔案

執行後會生成：
- `rich-menu-dashboard.png`：Rich Menu 圖片（2500 x 1686 像素）

## 注意事項

1. **Rich Menu 尺寸**：必須是 2500 x 1686 像素（完整版）或 2500 x 843 像素（精簡版）
2. **按鈕數量**：最多 6 個按鈕（3列 x 2行）
3. **圖片大小**：PNG 圖片必須小於 1 MB
4. **座標計算**：工具會自動計算座標，確保按鈕位置精確對齊

## 故障排除

### Puppeteer 安裝問題

如果遇到 Puppeteer 下載 Chromium 失敗，可以手動安裝：

```bash
npm install puppeteer --ignore-scripts
npx puppeteer browsers install chrome
```

### 權限問題

確保有寫入權限來生成圖片檔案。

### LINE API 錯誤

檢查 `LINE_CHANNEL_ACCESS_TOKEN` 是否正確，以及是否有建立 Rich Menu 的權限。

## 範例輸出

```
🚀 開始生成 Rich Menu 圖片...
✅ 圖片已生成：/path/to/rich-menu-dashboard.png
🚀 開始部署 Rich Menu 到 LINE...
📝 建立 Rich Menu...
✅ Rich Menu 已建立，ID: richmenu-xxx
📤 上傳圖片...
✅ 圖片已上傳
⭐ 設定為預設 Rich Menu...
✅ 已設定為預設 Rich Menu
🎉 Rich Menu 部署完成！
📱 Rich Menu ID: richmenu-xxx

✨ 所有步驟完成！
```

