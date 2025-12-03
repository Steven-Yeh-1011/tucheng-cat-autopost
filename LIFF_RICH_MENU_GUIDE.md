# LIFF Rich Menu 使用指南

## 概述

系統已實作**用 CSS 動態生成的 Rich Menu**，在 LIFF 應用中顯示，每個按鈕對應到相對的 URL。

## 架構說明

### 後端 API
- **端點：** `GET /line/rich-menu-config`
- **功能：** 返回 Rich Menu 的配置（按鈕位置、樣式、URL 等）
- **格式：** JSON

### 前端頁面
- **Rich Menu 頁面：** `/rich-menu` - 顯示 Rich Menu 界面
- **編輯器：** `/editor` - 貼文編輯器
- **草稿列表：** `/drafts` - 查看所有草稿
- **生成草稿：** `/generate` - AI 生成草稿
- **關於：** `/about` - 關於我們
- **聯絡：** `/contact` - 聯絡我們

## 使用方式

### 1. 訪問 Rich Menu 頁面

在 LINE 中開啟 LIFF 應用，導航至：
```
https://your-liff-app.vercel.app/rich-menu
```

### 2. Rich Menu 配置

Rich Menu 配置由後端 API 提供，包含：

```json
{
  "id": "tucheng-cat-default",
  "name": "土城浪貓主選單",
  "size": {
    "width": 2500,
    "height": 1686
  },
  "buttons": [
    {
      "id": "editor",
      "label": "編輯器",
      "position": { "x": 0, "y": 0, "width": 833, "height": 843 },
      "action": {
        "type": "uri",
        "uri": "/editor"
      },
      "style": {
        "backgroundColor": "#4F46E5",
        "textColor": "#FFFFFF",
        "icon": "✏️"
      }
    }
    // ... 其他按鈕
  ]
}
```

### 3. 按鈕動作

每個按鈕支援三種動作類型：

#### URI 動作（導航到頁面）
```json
{
  "type": "uri",
  "uri": "/editor"  // 相對路徑，會導航到 /editor 頁面
}
```

#### Postback 動作（觸發後端事件）
```json
{
  "type": "postback",
  "data": "action=view_drafts"
}
```

#### Message 動作（發送訊息）
```json
{
  "type": "message",
  "text": "關於我們"
}
```

## 預設 Rich Menu 配置

系統預設包含 6 個按鈕：

| 位置 | 按鈕 | URL | 說明 |
|------|------|-----|------|
| 左上 | 編輯器 | `/editor` | 開啟貼文編輯器 |
| 中上 | 查看草稿 | `/drafts` | 查看所有草稿 |
| 右上 | 生成草稿 | `/generate` | AI 生成草稿 |
| 左下 | Facebook | 外部連結 | 前往 Facebook 頁面 |
| 中下 | 關於 | `/about` | 關於我們 |
| 右下 | 聯絡 | `/contact` | 聯絡我們 |

## 自訂 Rich Menu

### 修改後端配置

編輯 `apps/backend/src/line/rich-menu-config.controller.ts`：

```typescript
buttons: [
  {
    id: 'custom-button',
    label: '自訂按鈕',
    position: { x: 0, y: 0, width: 833, height: 843 },
    action: {
      type: 'uri',
      uri: '/custom-page',  // 相對路徑
    },
    style: {
      backgroundColor: '#FF5733',
      textColor: '#FFFFFF',
      icon: '🎯',
    },
  },
]
```

### 建立對應的頁面

在 `apps/liff-editor/app/` 下建立對應的頁面：

```typescript
// apps/liff-editor/app/custom-page/page.tsx
export default function CustomPage() {
  return <div>自訂頁面內容</div>;
}
```

## 環境變數設定

### 後端（Render）

設定以下環境變數以確保 URL 正確：

- `LIFF_BASE_URL` - LIFF 應用的完整 URL（例如：`https://your-app.vercel.app`）
- `VERCEL_PROJECT_PRODUCTION_URL` - Vercel 生產環境 URL（如果使用 Vercel）

### 前端（Vercel）

- `NEXT_PUBLIC_BACKEND_URL` - 後端 API URL

## 樣式自訂

Rich Menu 的樣式可以在以下位置修改：

1. **按鈕顏色和樣式：** `rich-menu-config.controller.ts` 中的 `style` 屬性
2. **整體外觀：** `apps/liff-editor/app/rich-menu/page.tsx` 中的 CSS

### 按鈕樣式選項

```typescript
style: {
  backgroundColor: '#4F46E5',  // 按鈕背景色
  textColor: '#FFFFFF',         // 文字顏色
  icon: '✏️',                   // 圖示（emoji）
}
```

## 響應式設計

Rich Menu 會自動適應不同螢幕尺寸：
- 自動縮放以適應螢幕寬度
- 保持按鈕比例
- 觸控友好的按鈕大小

## 測試

### 本地測試

1. 啟動後端：
   ```bash
   cd apps/backend
   npm run start:dev
   ```

2. 啟動前端：
   ```bash
   cd apps/liff-editor
   npm run dev
   ```

3. 訪問 Rich Menu：
   ```
   http://localhost:3000/rich-menu
   ```

### 生產環境測試

1. 確認後端 API 可訪問：
   ```bash
   curl https://your-backend.onrender.com/line/rich-menu-config
   ```

2. 在 LINE 中開啟 LIFF 應用：
   ```
   https://your-liff-app.vercel.app/rich-menu
   ```

## 與 LINE Rich Menu 的整合

這個 CSS 版本的 Rich Menu 可以與 LINE 原生的 Rich Menu 並存：

1. **CSS 版本（LIFF 內）：** 在 LIFF 應用中顯示，提供更豐富的互動
2. **LINE 原生版本：** 在 LINE 聊天室下方顯示（需要上傳圖片）

兩者可以同時使用，提供不同的使用體驗。

## 常見問題

### Q: 為什麼按鈕點擊沒有反應？

**檢查：**
1. 確認後端 API 可訪問
2. 檢查瀏覽器控制台是否有錯誤
3. 確認 URL 路徑是否正確

### Q: 如何修改按鈕的 URL？

編輯 `rich-menu-config.controller.ts` 中的 `action.uri` 欄位。

### Q: 可以添加更多按鈕嗎？

可以，但需要確保按鈕位置不重疊。Rich Menu 尺寸為 2500x1686，需要計算好每個按鈕的位置。

### Q: 如何改變按鈕顏色？

修改 `style.backgroundColor` 和 `style.textColor`。

## 相關文件

- 後端 API：`apps/backend/src/line/rich-menu-config.controller.ts`
- Rich Menu 頁面：`apps/liff-editor/app/rich-menu/page.tsx`
- LINE Rich Menu API：`LINE_RICH_MENU_GUIDE.md`

---

**建立時間：** 2025-01-XX
**版本：** 1.0.0

