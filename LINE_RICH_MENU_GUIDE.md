# LINE Rich Menu 設定指南

## 概述

Rich Menu（圖文選單）是顯示在 LINE 官方帳號聊天室下方的互動選單，透過圖片與點擊區塊設計，可導引用戶進行多種行動。

## 功能說明

目前系統已實作完整的 Rich Menu 管理功能，包括：
- ✅ 建立 Rich Menu
- ✅ 上傳 Rich Menu 圖片
- ✅ 設定預設 Rich Menu（所有用戶）
- ✅ 為特定用戶設定 Rich Menu
- ✅ 查詢 Rich Menu 列表和詳情
- ✅ 刪除 Rich Menu
- ✅ 建立預設的「土城浪貓」Rich Menu

## 前置需求

### 1. LINE 官方帳號設定

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇您的 Provider 和 Channel
3. 取得以下資訊：
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token**（長期 Token）

### 2. 設定環境變數

在 Render Dashboard 的環境變數中設定：
- `LINE_CHANNEL_ID`（可選，如果有多個 channel）
- `LINE_CHANNEL_SECRET`（可選）
- `LINE_CHANNEL_ACCESS_TOKEN`（可選）

**注意：** 目前系統從資料庫的 `LineCredential` 表讀取憑證，所以需要先透過授權流程將憑證存入資料庫。

### 3. LIFF URL 設定

確保 `LIFF_EDITOR_URL` 環境變數已設定為您的 LIFF 編輯器網址。

## API 端點

### 1. 建立預設 Rich Menu（推薦）

這是最簡單的方式，會自動建立一個包含 6 個按鈕的預設 Rich Menu。

```bash
POST /line/rich-menu/default?channelId=<your-channel-id>
```

**回應：**
```json
{
  "richMenuId": "richmenu-xxx",
  "message": "Default rich menu created. Please upload image and set as default."
}
```

### 2. 上傳 Rich Menu 圖片

**重要：** Rich Menu 圖片必須符合以下規格：
- **尺寸：** 2500 x 1686 像素（完整版）或 2500 x 843 像素（精簡版）
- **格式：** JPG 或 PNG
- **檔案大小：** 最大 1 MB

```bash
POST /line/rich-menu/:richMenuId/image?channelId=<your-channel-id>
Content-Type: multipart/form-data

# 使用 curl
curl -X POST \
  "https://your-backend.onrender.com/line/rich-menu/richmenu-xxx/image?channelId=xxx" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/richmenu-image.jpg"
```

### 3. 設定為預設 Rich Menu

設定後，所有加為好友的用戶都會看到這個 Rich Menu。

```bash
POST /line/rich-menu/:richMenuId/set-default?channelId=<your-channel-id>
```

### 4. 查詢 Rich Menu 列表

```bash
GET /line/rich-menu?channelId=<your-channel-id>
```

### 5. 查詢 Rich Menu 詳情

```bash
GET /line/rich-menu/:richMenuId?channelId=<your-channel-id>
```

### 6. 刪除 Rich Menu

```bash
DELETE /line/rich-menu/:richMenuId?channelId=<your-channel-id>
```

## 完整設定流程

### 步驟 1：建立 Rich Menu

```bash
# 建立預設 Rich Menu
curl -X POST \
  "https://your-backend.onrender.com/line/rich-menu/default?channelId=YOUR_CHANNEL_ID"
```

**回應：**
```json
{
  "richMenuId": "richmenu-abc123",
  "message": "Default rich menu created. Please upload image and set as default."
}
```

### 步驟 2：準備圖片

設計 Rich Menu 圖片：
- 尺寸：2500 x 1686 像素
- 格式：JPG 或 PNG
- 檔案大小：< 1 MB

**預設 Rich Menu 的按鈕區域：**
- 左上（0, 0, 833, 843）：編輯器
- 中上（833, 0, 833, 843）：查看草稿
- 右上（1666, 0, 834, 843）：生成草稿
- 左下（0, 843, 833, 843）：Facebook
- 中下（833, 843, 833, 843）：關於
- 右下（1666, 843, 834, 843）：聯絡

### 步驟 3：上傳圖片

```bash
curl -X POST \
  "https://your-backend.onrender.com/line/rich-menu/richmenu-abc123/image?channelId=YOUR_CHANNEL_ID" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@richmenu-image.jpg"
```

### 步驟 4：設定為預設

```bash
curl -X POST \
  "https://your-backend.onrender.com/line/rich-menu/richmenu-abc123/set-default?channelId=YOUR_CHANNEL_ID"
```

### 步驟 5：驗證

1. 開啟 LINE 應用程式
2. 進入您的官方帳號聊天室
3. 應該可以看到 Rich Menu 顯示在聊天室下方

## 自訂 Rich Menu

如果需要自訂 Rich Menu 的按鈕配置，可以使用以下 API：

```bash
POST /line/rich-menu?channelId=<your-channel-id>
Content-Type: application/json

{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "自訂選單",
  "chatBarText": "選單",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "uri",
        "uri": "https://your-liff-url",
        "label": "開啟編輯器"
      }
    },
    {
      "bounds": {
        "x": 1250,
        "y": 0,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "postback",
        "data": "action=help",
        "label": "幫助"
      }
    }
  ]
}
```

## 按鈕動作類型

### 1. URI 動作（開啟網頁或 LIFF）
```json
{
  "type": "uri",
  "uri": "https://liff.line.me/your-liff-id",
  "label": "開啟編輯器"
}
```

### 2. Postback 動作（觸發後端事件）
```json
{
  "type": "postback",
  "data": "action=view_drafts",
  "label": "查看草稿"
}
```

### 3. Message 動作（發送訊息）
```json
{
  "type": "message",
  "text": "關於我們",
  "label": "關於"
}
```

## 常見問題

### Q: 為什麼看不到 Rich Menu？

**可能原因：**
1. 尚未設定預設 Rich Menu
2. 圖片未上傳
3. 用戶尚未加為好友（Rich Menu 只對好友顯示）
4. Channel Access Token 無效或過期

**解決方法：**
1. 確認已執行 `set-default` API
2. 確認圖片已上傳
3. 確認用戶已加為好友
4. 檢查 Channel Access Token 是否有效

### Q: 如何更新 Rich Menu？

1. 建立新的 Rich Menu
2. 上傳新圖片
3. 設定為預設
4. （可選）刪除舊的 Rich Menu

### Q: 如何為特定用戶設定不同的 Rich Menu？

```bash
POST /line/rich-menu/:richMenuId/set-user?channelId=xxx&userId=USER_ID
```

### Q: Rich Menu 圖片規格？

- **完整版：** 2500 x 1686 像素
- **精簡版：** 2500 x 843 像素
- **格式：** JPG 或 PNG
- **檔案大小：** 最大 1 MB

## 設計建議

1. **視覺清晰**：使用對比色和清晰的文字
2. **按鈕區域**：確保按鈕區域在圖片上清晰可見
3. **品牌一致性**：符合「土城浪貓」的品牌形象
4. **功能導向**：將最常用的功能放在顯眼位置

## 相關文件

- [LINE Rich Menu API 文件](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)
- [Rich Menu 設計指南](https://developers.line.biz/en/docs/messaging-api/rich-menu/#rich-menu-image-specifications)

## 技術細節

### 服務架構
- `RichMenuService`：處理所有 Rich Menu 相關的業務邏輯
- `RichMenuController`：提供 REST API 端點
- LINE Bot SDK：使用 `@line/bot-sdk` 與 LINE API 互動

### 憑證管理
- 從 `LineCredential` 資料表讀取 Channel Access Token
- 支援多個 Channel（透過 channelId 區分）
- Token 過期檢查（未來可實作自動刷新）

---

**建立時間：** 2025-01-XX
**版本：** 1.0.0

