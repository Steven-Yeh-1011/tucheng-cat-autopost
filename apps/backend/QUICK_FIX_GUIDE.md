# 快速修復指南

## 問題 1: Cronjob 失敗 - 快速修復

### 原因
Google AI 模型名稱錯誤導致 API 呼叫失敗。

### 快速修復方案（兩種選擇）

#### 方案 A：暫時使用 Placeholder（最快）
在 Render Dashboard 中暫時移除 `GEMINI_API_KEY` 環境變數：
1. Render Dashboard → `generate-daily-draft` Cron Job
2. Environment → 刪除或重新命名 `GEMINI_API_KEY`
3. Cronjob 會自動使用 placeholder 草稿，不會失敗

#### 方案 B：等待重新建置（永久解決）
1. 提交並推送程式碼到 git
2. Render 會自動重新建置
3. 建置完成後，模型名稱會更新為 `gemini-pro`

---

## 問題 2: Rich Menu 看不到 - 快速修復

### 當前狀態
- ✅ Rich Menu 已部署：`richmenu-b9620923e8a7097e812dd6a7b02bd147`
- ✅ 已設定為預設
- ❌ 但看不到

### 最可能的原因
**用戶被連結到特定的 Rich Menu，覆蓋了預設設定**

### 快速修復步驟

#### 步驟 1：取得您的 LINE User ID
1. 在 LINE 中開啟您的官方帳號
2. 發送一則訊息（觸發 webhook）
3. 在 Render Dashboard → Web Service → Logs 中查看 webhook 日誌
4. 找到 `source.userId` 欄位，這就是您的 User ID

#### 步驟 2：檢查用戶是否被連結到特定的 Rich Menu
```powershell
$token = "YOUR_CHANNEL_ACCESS_TOKEN"  # 從 .env 取得
$userId = "YOUR_LINE_USER_ID"  # 步驟 1 取得的 ID

Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/$userId/richmenu" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```

**如果返回 Rich Menu ID：**
- 用戶被連結到特定的 Rich Menu
- 需要取消連結

#### 步驟 3：取消用戶特定的 Rich Menu 連結
```powershell
$token = "YOUR_CHANNEL_ACCESS_TOKEN"
$userId = "YOUR_LINE_USER_ID"

# 取消連結
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/$userId/richmenu" `
  -Method Delete `
  -Headers @{ "Authorization" = "Bearer $token" }
```

取消後，用戶應該會看到預設 Rich Menu。

#### 步驟 4：或重新連結到新的 Rich Menu
```powershell
$token = "YOUR_CHANNEL_ACCESS_TOKEN"
$userId = "YOUR_LINE_USER_ID"
$richMenuId = "richmenu-b9620923e8a7097e812dd6a7b02bd147"

# 連結到新的 Rich Menu
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/$userId/richmenu/$richMenuId" `
  -Method Post `
  -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 如果還是看不到

### 其他可能的原因

1. **等待時間不足**
   - 等待 15-30 分鐘
   - 完全關閉並重新開啟 LINE
   - 重新開啟聊天室

2. **LINE 應用程式版本**
   - 更新到最新版本
   - 清除快取

3. **多個 Rich Menu 衝突**
   - 檢查是否有其他 Rich Menu 標記為預設
   - 刪除衝突的 Rich Menu

### 終極檢查清單

- [ ] 用戶沒有被連結到特定的 Rich Menu
- [ ] 預設 Rich Menu 已正確設定
- [ ] 等待超過 15 分鐘
- [ ] 完全關閉並重新開啟 LINE
- [ ] LINE 應用程式已更新到最新版本
- [ ] 使用不同裝置測試（手機、電腦）

---

## 聯絡 LINE 支援

如果以上方法都失敗，可能需要：
1. 檢查 LINE Developers Console 中的設定
2. 聯絡 LINE 技術支援
3. 檢查是否有地區或帳號限制

