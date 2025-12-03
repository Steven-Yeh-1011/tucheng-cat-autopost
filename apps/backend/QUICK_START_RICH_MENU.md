# Rich Menu 快速開始指南

## ⚠️ 重要：您需要實際的 Token

在執行任何命令之前，請先取得您的 LINE Channel Access Token。

## 步驟 1：取得 LINE Channel Access Token

1. **前往 LINE Developers Console**
   - 網址：https://developers.line.biz/console/
   - 使用您的 LINE 帳號登入

2. **選擇您的 Channel**
   - 選擇對應的 Provider
   - 選擇您的 Channel（Messaging API）

3. **生成長期 Token**
   - 進入 **Messaging API** 頁籤
   - 找到 **Channel access token** 區塊
   - 點擊 **Issue** 按鈕
   - 選擇 **Long-lived token**（長期 Token）
   - 複製生成的 Token（格式類似：`abc123xyz456...`）

4. **取得 Channel ID**
   - 在同一個頁面的 **Basic settings** 區塊
   - 找到 **Channel ID** 並複製

## 步驟 2：設定環境變數（Render）

1. **前往 Render Dashboard**
   - https://dashboard.render.com
   - 選擇 `tucheng-cat-autopost` 服務

2. **設定環境變數**
   - 進入 **Environment** 頁籤
   - 點擊 **Add Environment Variable**
   - 添加以下變數：
     ```
     LINE_CHANNEL_ACCESS_TOKEN = 您剛才複製的 Token
     LIFF_URL = https://liff.line.me/2008612222-PgzW5BGy
     ```
   - 點擊 **Save Changes**

3. **重新部署**
   - Render 會自動重新部署
   - 或手動點擊 **Manual Deploy** → **Deploy latest commit**

## 步驟 3：測試 Token（本地測試）

在 PowerShell 中執行（**記得替換實際的 Token**）：

### 方法 1：單行命令（推薦，避免多行問題）

```powershell
# 將 YOUR_ACTUAL_TOKEN 替換為您剛才複製的實際 Token
$token = "YOUR_ACTUAL_TOKEN"; Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

### 方法 2：分步執行

```powershell
# 步驟 1：設定 Token
$token = "YOUR_ACTUAL_TOKEN"

# 步驟 2：測試 Token（單行）
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

### 方法 3：如果遇到 PowerShell 錯誤

如果 PowerShell 出現語法錯誤，請：
1. **清除終端**：輸入 `Clear-Host` 或按 `Ctrl+L`
2. **重新開啟 PowerShell**：關閉並重新開啟終端
3. **使用單行命令**：避免使用反引號 ` 進行多行輸入

### 實際範例（使用您的 Token）

```powershell
$token = "TQbc8YYzVEFkX6WK3dVPNlo69Z0y4Gg39QBD5EV6/bMs+zM4HLODqyY0v+5idHysUy5tIx6Hgbq28S28qgN2PzPtxOpnstcKgWZZnxLKov9th2PKJDg7ZA4OGKcP//4RcRKoEz8Dt/8j462uXcoRkAdB04t89/1O/w1cDnyilFU="
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

**成功範例回應：**
```json
{
  "userId": "U1234567890abcdef...",
  "basicId": "@123abc",
  "displayName": "土城浪貓",
  "pictureUrl": "https://...",
  ...
}
```

**如果失敗：**
- ❌ Token 無效或已過期 → 重新生成 Token
- ❌ Token 格式錯誤 → 檢查是否有複製完整
- ❌ 使用了佔位符 `YOUR_CHANNEL_ACCESS_TOKEN` → 替換為實際 Token

## 步驟 4：執行診斷

使用自動化診斷腳本（**記得替換實際的值**）：

```powershell
cd apps/backend
.\test-rich-menu.ps1 -ChannelId "YOUR_CHANNEL_ID" -Token "YOUR_ACTUAL_TOKEN"
```

這會自動檢查：
- ✅ Token 是否有效
- ✅ Rich Menu 列表
- ✅ 部署狀態和環境變數

## 步驟 5：部署 Rich Menu

如果診斷顯示一切正常，但 `richMenuCount` 為 `0`，需要執行部署。

### 方法 A：使用 API 手動部署

**步驟 1：建立 Rich Menu**
```powershell
$channelId = "YOUR_CHANNEL_ID"
Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu/default?channelId=$channelId" `
  -Method Post
```

回應會包含 `richMenuId`，記下這個 ID。

**步驟 2：上傳圖片**
```powershell
$richMenuId = "richmenu-xxx"  # 使用步驟 1 獲得的 ID
$channelId = "YOUR_CHANNEL_ID"
$imagePath = "rich-menu-dashboard.png"  # 圖片路徑

$form = @{
    image = Get-Item -Path $imagePath
}
Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu/$richMenuId/image?channelId=$channelId" `
  -Method Post `
  -Form $form
```

**步驟 3：設定為預設**
```powershell
$richMenuId = "richmenu-xxx"
$channelId = "YOUR_CHANNEL_ID"
Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu/$richMenuId/set-default?channelId=$channelId" `
  -Method Post
```

### 方法 B：使用自動生成腳本

如果圖片已生成，可以使用自動部署 API：

```powershell
$channelId = "YOUR_CHANNEL_ID"
Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/auto?channelId=$channelId" `
  -Method Post
```

## 常見錯誤

### 錯誤 1：`Authentication failed`
**原因**：使用了佔位符 `YOUR_CHANNEL_ACCESS_TOKEN` 而不是實際 Token

**解決方案**：替換為實際的 Token

### 錯誤 2：`No access token found`
**原因**：Render 環境變數未設定或名稱錯誤

**解決方案**：
1. 檢查 Render Dashboard 環境變數
2. 確認變數名稱是 `LINE_CHANNEL_ACCESS_TOKEN`（大小寫敏感）
3. 重新部署服務

### 錯誤 3：`richMenuCount: 0`
**原因**：還沒有部署 Rich Menu

**解決方案**：按照步驟 5 執行部署

## 需要幫助？

如果按照以上步驟仍無法解決，請提供：
1. 步驟 3 的 Token 測試結果（隱藏實際 Token）
2. 步驟 4 的診斷結果
3. Render 後端日誌中的錯誤訊息

