# Rich Menu 診斷指南

## 問題：Rich Menu 沒有顯示

根據 Render 日誌分析，後端服務正常運行，但沒有看到 Rich Menu 部署的記錄。

## 立即診斷步驟

### 步驟 1：檢查環境變數

請確認 Render Dashboard 中已設定以下環境變數：

```bash
# 必需
LINE_CHANNEL_ACCESS_TOKEN=your_long_lived_token
LIFF_URL=https://liff.line.me/2008612222-PgzW5BGy

# 可選（用於多 Channel 場景）
LINE_CHANNEL_ID=your_channel_id
```

**檢查方式**：
1. 前往 Render Dashboard → `tucheng-cat-autopost` → Environment
2. 確認 `LINE_CHANNEL_ACCESS_TOKEN` 和 `LIFF_URL` 已設定

### 步驟 2：測試 Token 有效性

使用以下命令測試 Token 是否有效：

**Linux/Mac (Bash):**
```bash
curl -X GET \
  "https://api.line.me/v2/bot/info" \
  -H "Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN"
```

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer YOUR_CHANNEL_ACCESS_TOKEN" }
```

**使用診斷腳本（推薦）:**

我們提供了自動化診斷腳本，可以一次執行所有檢查：

**Linux/Mac:**
```bash
cd apps/backend
bash test-rich-menu.sh YOUR_CHANNEL_ID YOUR_LINE_CHANNEL_ACCESS_TOKEN
```

**Windows PowerShell:**
```powershell
cd apps/backend
.\test-rich-menu.ps1 -ChannelId "YOUR_CHANNEL_ID" -Token "YOUR_LINE_CHANNEL_ACCESS_TOKEN"
```

**預期結果**：應該返回 Channel 資訊 JSON，包含 `userId`、`basicId` 等。

**成功範例：**
```json
{
  "userId": "U1234567890abcdef...",
  "basicId": "@123abc",
  "premiumId": "@premium123",
  "displayName": "土城浪貓",
  ...
}
```

**如果失敗**：
- Token 無效或已過期
- 需要重新生成長期 Token
- 檢查 Token 是否正確複製（沒有多餘空格）

### 步驟 3：檢查 Rich Menu 列表

呼叫 API 檢查是否已有 Rich Menu：

```bash
# 替換 YOUR_CHANNEL_ID 為實際的 Channel ID
curl -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu?channelId=YOUR_CHANNEL_ID"
```

**預期結果**：
- 如果已有 Rich Menu：返回 `{"data": [...]}`
- 如果沒有：返回 `{"data": []}`

### 步驟 4：檢查部署狀態

使用新的狀態檢查 API：

```bash
curl -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/status?channelId=YOUR_CHANNEL_ID"
```

**預期回應**：
```json
{
  "channelId": "your-channel-id",
  "richMenuCount": 0,
  "richMenus": [],
  "imageExists": false,
  "environment": {
    "hasAccessToken": true,
    "hasLiffUrl": true
  }
}
```

**檢查重點**：
- `hasAccessToken`: 應該是 `true`
- `hasLiffUrl`: 應該是 `true`
- `richMenuCount`: 如果為 `0`，表示還沒有部署 Rich Menu

### 步驟 5：執行部署

如果確認環境變數正確，但 `richMenuCount` 為 `0`，需要執行部署。

#### 方法 A：使用自動生成腳本（需要本地或 Render Shell）

```bash
# 在 Render Shell 或本地執行
cd apps/backend
npm run rich-menu:generate
```

**注意**：這個方法需要：
1. Puppeteer 可以運行（在 Render 上可能需要額外配置）
2. 圖片會生成在後端目錄

#### 方法 B：使用 API 一鍵部署（推薦）

如果已經有生成的圖片，可以使用 API：

```bash
POST https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/auto?channelId=YOUR_CHANNEL_ID
```

**注意**：這個方法需要圖片檔案在後端伺服器上。

#### 方法 C：手動部署（分步驟）

**步驟 1：建立 Rich Menu**

```bash
curl -X POST \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu/default?channelId=YOUR_CHANNEL_ID"
```

回應應該包含 `richMenuId`。

**步驟 2：上傳圖片**

```bash
# 替換 RICH_MENU_ID 為上一步獲得的 ID
curl -X POST \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu/RICH_MENU_ID/image?channelId=YOUR_CHANNEL_ID" \
  -F "image=@rich-menu-dashboard.png"
```

**步驟 3：設定為預設**

```bash
curl -X POST \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu/RICH_MENU_ID/set-default?channelId=YOUR_CHANNEL_ID"
```

## 常見問題診斷

### 問題 1：`hasAccessToken: false`

**原因**：`LINE_CHANNEL_ACCESS_TOKEN` 未設定或無法讀取

**解決方案**：
1. 檢查 Render Dashboard 環境變數
2. 確認變數名稱正確（大小寫敏感）
3. 重新部署服務

### 問題 2：`richMenuCount: 0`

**原因**：還沒有部署 Rich Menu

**解決方案**：按照「步驟 5：執行部署」進行部署

### 問題 3：Token 測試失敗

**原因**：
- Token 無效
- Token 已過期
- Token 格式錯誤

**解決方案**：
1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 重新生成長期 Token（Long-lived token）
3. 更新 Render 環境變數
4. 重新部署服務

### 問題 4：部署後仍看不到 Rich Menu

**可能原因**：
1. Rich Menu 沒有上傳圖片
2. Rich Menu 沒有設定為預設
3. 需要等待 1-5 分鐘讓 LINE 同步
4. 需要重新開啟 LINE 聊天室

**解決方案**：
1. 確認部署步驟完整（建立 → 上傳圖片 → 設定預設）
2. 等待幾分鐘
3. 重新開啟 LINE 聊天室
4. 檢查 Rich Menu 列表確認狀態

## 快速診斷命令

將以下命令中的 `YOUR_CHANNEL_ID` 和 `YOUR_TOKEN` 替換為實際值：

```bash
# 1. 測試 Token
curl -X GET "https://api.line.me/v2/bot/info" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. 檢查 Rich Menu 列表
curl -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu?channelId=YOUR_CHANNEL_ID"

# 3. 檢查部署狀態
curl -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/status?channelId=YOUR_CHANNEL_ID"
```

## 需要幫助？

如果按照以上步驟仍無法解決，請提供：
1. 步驟 2 的 Token 測試結果
2. 步驟 4 的狀態檢查結果
3. Render 後端日誌（特別是 Rich Menu 相關的錯誤）
4. Channel ID（不提供實際 Token）

