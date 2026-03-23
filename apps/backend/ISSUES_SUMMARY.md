# 當前問題總結與解決方案

## 問題 1: Cronjob 失敗

### 錯誤原因
Google AI 模型名稱錯誤。編譯後的 `dist/openai/openai.service.js` 仍使用舊的模型名稱 `gemini-1.5-flash`，導致 API 呼叫失敗。

### 已修正
- ✅ 源碼已更新為 `gemini-pro`
- ❌ **但 Render 上的編譯產物還沒更新**

### 解決方案

**方法 1：讓 Render 自動重新建置（推薦）**
1. 提交並推送程式碼到 git repository
2. Render 會自動重新建置並部署
3. 這樣 `dist/` 目錄中的檔案就會使用新的模型名稱

**方法 2：暫時讓 cronjob 使用 placeholder（快速修復）**
- 如果不想等待 Google AI 模型名稱修正
- 可以暫時移除 `GEMINI_API_KEY` 環境變數
- cronjob 會自動使用 placeholder 草稿，不會失敗

### 需要確認
請檢查 Render Dashboard 中的 `generate-daily-draft` Cron Job：
- 是否已經重新部署最新的程式碼？
- `dist/` 目錄中的檔案是否已更新？

---

## 問題 2: Rich Menu 看不到

### 當前狀態
- ✅ Rich Menu 已成功部署到正確的 Channel (`2008557763`)
- ✅ 已設定為預設 Rich Menu
- ✅ 所有 API 呼叫都成功
- ❌ 但在 LINE 聊天室中看不到

### 已部署的 Rich Menu
- **Rich Menu ID**: `richmenu-b9620923e8a7097e812dd6a7b02bd147`
- **名稱**: 土城浪貓主選單
- **Channel ID**: `2008557763`
- **LIFF URL**: `https://liff.line.me/2008612222-PgzW5BGy`

### 可能的原因

#### 1. 用戶特定的 Rich Menu 連結（最可能）
如果用戶之前被連結到特定的 Rich Menu（例如 "L1 Landing Menu"），預設 Rich Menu 不會覆蓋用戶特定的連結。

**解決方案：**
需要取消用戶特定的 Rich Menu 連結，或重新連結到新的 Rich Menu。

#### 2. LINE 同步延遲
Rich Menu 可能需要更長時間才能顯示。

**解決方案：**
- 等待 10-15 分鐘
- 完全關閉並重新開啟 LINE 應用程式
- 重新開啟聊天室

#### 3. 多個預設 Rich Menu 衝突
系統中存在多個 Rich Menu 標記為 `selected: true`，可能導致衝突。

**解決方案：**
- 檢查並刪除其他衝突的 Rich Menu
- 確保只有一個預設 Rich Menu

#### 4. LINE 應用程式快取
LINE 可能快取了舊的 Rich Menu。

**解決方案：**
- 清除 LINE 快取
- 重新安裝 LINE 應用程式（最後手段）

### 建議的檢查步驟

1. **檢查用戶特定的 Rich Menu 連結**
   ```powershell
   # 需要用戶的 LINE User ID
   # 可以從 webhook 事件或 LINE Developers Console 取得
   $token = $env:LINE_CHANNEL_ACCESS_TOKEN
   $userId = "USER_LINE_ID"  # 替換為實際的用戶 ID
   Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/$userId/richmenu" `
     -Method Get `
     -Headers @{ "Authorization" = "Bearer $token" }
   ```

2. **重新設定預設 Rich Menu**
   ```powershell
   $token = $env:LINE_CHANNEL_ACCESS_TOKEN
   $richMenuId = "richmenu-b9620923e8a7097e812dd6a7b02bd147"
   
   # 設定為預設
   Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu/$richMenuId" `
     -Method Post `
     -Headers @{ "Authorization" = "Bearer $token" }
   ```

3. **檢查所有 Rich Menu**
   ```powershell
   $token = $env:LINE_CHANNEL_ACCESS_TOKEN
   Invoke-RestMethod -Uri "https://api.line.me/v2/bot/richmenu/list" `
     -Method Get `
     -Headers @{ "Authorization" = "Bearer $token" }
   ```

### 最關鍵的問題

**為什麼 API 顯示 Rich Menu 已設定為預設，但在 LINE 應用程式中看不到？**

這通常表示：
1. 用戶被連結到特定的 Rich Menu（不是預設）
2. 需要取消用戶特定的連結，讓預設 Rich Menu 生效

---

## 下一步行動

### 立即處理

1. **Cronjob 問題**
   - [ ] 提交並推送程式碼到 git
   - [ ] 等待 Render 自動重新建置
   - [ ] 或暫時移除 `GEMINI_API_KEY` 讓 cronjob 使用 placeholder

2. **Rich Menu 問題**
   - [ ] 檢查用戶是否被連結到特定的 Rich Menu
   - [ ] 如果是，取消連結或重新連結
   - [ ] 等待 10-15 分鐘並重新開啟 LINE

### 需要更多資訊

如果您能提供：
1. Cronjob 的詳細錯誤日誌（如果還有新的錯誤）
2. 測試用戶的 LINE User ID（可以檢查用戶特定的連結）
3. Render 上的建置日誌（確認是否已重新建置）

這樣我可以更精確地診斷問題。

