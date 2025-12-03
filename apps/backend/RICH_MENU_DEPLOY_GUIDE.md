# LINE Rich Menu 部署完整指南

## 問題：Rich Menu 沒有顯示

如果 LINE 聊天室底部沒有看到 Rich Menu，請按照以下步驟檢查和部署。

## 快速檢查清單

### 1. 環境變數設定（Render Dashboard）

在 **Render Dashboard** → **tucheng-cat-autopost-backend** → **Environment** 確認：

- [ ] `LINE_CHANNEL_ACCESS_TOKEN` - LINE Channel Access Token（**必需**）
- [ ] `LIFF_URL` - 完整的 LIFF URL（例如：`https://liff.line.me/2008612222-PgzW5BGy`）

### 2. 取得 LINE Channel Access Token

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇您的 Provider 和 Channel
3. 進入 **Messaging API** 頁籤
4. 找到 **Channel access token** 區塊
5. 點擊 **Issue** 生成長期 Token（Long-lived token）
6. 複製 Token 並設定到 Render 環境變數

**重要**：必須是 **長期 Token（Long-lived token）**，短期 Token 會過期。

### 3. 取得 Channel ID

在 LINE Developers Console 的 Channel 設定頁面找到 **Channel ID**，稍後部署時需要用到。

## 部署方法

### 方法 1：使用自動生成腳本（推薦）

這個方法會自動生成圖片並部署：

```bash
# 在本地或 Render 環境中執行
cd apps/backend
npm run rich-menu:generate
```

**前提條件**：
- `LINE_CHANNEL_ACCESS_TOKEN` 已設定
- `LIFF_URL` 已設定（推薦）

### 方法 2：使用一鍵部署 API（最簡單）

如果已經有生成的圖片，可以使用 API 一鍵部署：

```bash
# 1. 先生成圖片（如果還沒有）
cd apps/backend
npm run rich-menu:generate

# 2. 使用 API 部署（需要先將圖片上傳到後端）
POST https://your-backend.onrender.com/line/rich-menu-deploy/auto?channelId=your-channel-id
```

**注意**：這個方法需要圖片檔案在後端伺服器上。

### 方法 3：手動部署（分步驟）

#### 步驟 1：建立 Rich Menu

```bash
POST https://your-backend.onrender.com/line/rich-menu/default?channelId=your-channel-id
```

回應：
```json
{
  "richMenuId": "richmenu-xxx",
  "message": "Default rich menu created. Please upload image and set as default."
}
```

#### 步驟 2：上傳圖片

使用生成的 `richMenuId` 上傳圖片：

```bash
POST https://your-backend.onrender.com/line/rich-menu/{richMenuId}/image?channelId=your-channel-id
Content-Type: multipart/form-data

# 使用 curl
curl -X POST \
  "https://your-backend.onrender.com/line/rich-menu/richmenu-xxx/image?channelId=your-channel-id" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@rich-menu-dashboard.png"
```

#### 步驟 3：設定為預設 Rich Menu

```bash
POST https://your-backend.onrender.com/line/rich-menu/{richMenuId}/set-default?channelId=your-channel-id
```

## 檢查部署狀態

### 檢查 Rich Menu 列表

```bash
GET https://your-backend.onrender.com/line/rich-menu?channelId=your-channel-id
```

### 檢查部署狀態（新功能）

```bash
GET https://your-backend.onrender.com/line/rich-menu-deploy/status?channelId=your-channel-id
```

回應會顯示：
- Rich Menu 數量
- 圖片是否存在
- 環境變數設定狀態

## 常見問題

### Q: 為什麼 Rich Menu 沒有顯示？

**可能原因**：
1. ❌ `LINE_CHANNEL_ACCESS_TOKEN` 未設定或無效
2. ❌ Rich Menu 沒有上傳圖片
3. ❌ Rich Menu 沒有設定為預設
4. ❌ Channel ID 錯誤
5. ❌ Token 已過期（需要重新生成長期 Token）

### Q: 如何確認 Token 是否有效？

可以嘗試呼叫 LINE API：

```bash
curl -X GET \
  "https://api.line.me/v2/bot/info" \
  -H "Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN"
```

如果返回 Channel 資訊，說明 Token 有效。

### Q: Rich Menu 部署後多久會顯示？

通常需要 **1-5 分鐘** 才會在 LINE 中顯示。請：
1. 等待幾分鐘
2. 重新開啟 LINE 聊天室
3. 或者重新加為好友

### Q: 如何更新 Rich Menu？

1. 刪除舊的 Rich Menu
2. 重新建立並上傳新的圖片
3. 設定為預設

或直接使用自動生成腳本重新部署。

## 完整部署流程

### 第一次部署

1. **設定環境變數**（Render Dashboard）
   ```
   LINE_CHANNEL_ACCESS_TOKEN=your_long_lived_token
   LIFF_URL=https://liff.line.me/2008612222-PgzW5BGy
   ```

2. **生成圖片並部署**（在 Render 或本地）
   ```bash
   cd apps/backend
   npm run rich-menu:generate
   ```

3. **等待部署完成**（查看日誌確認）

4. **在 LINE 中測試**
   - 重新開啟 LINE 聊天室
   - 應該會在底部看到 Rich Menu

### 更新 Rich Menu

1. 修改 `apps/backend/src/scripts/generate-rich-menu.ts` 中的 `BUTTON_CONFIG`
2. 重新執行 `npm run rich-menu:generate`
3. 腳本會自動刪除舊的並建立新的 Rich Menu

## 調試工具

### 檢查環境變數

在後端日誌中查看是否有以下訊息：
- `Using LINE_CHANNEL_ACCESS_TOKEN from environment variable` ✅
- `No access token found for channel` ❌

### 檢查 Rich Menu 列表

```bash
GET /line/rich-menu?channelId=your-channel-id
```

應該會返回已建立的 Rich Menu 列表。

## 需要幫助？

如果按照以上步驟仍無法解決，請提供：
1. Render 後端日誌（特別是 Rich Menu 相關的錯誤）
2. `LINE_CHANNEL_ACCESS_TOKEN` 是否已設定（不提供實際 Token）
3. Channel ID
4. 執行 `GET /line/rich-menu-deploy/status?channelId=xxx` 的回應

