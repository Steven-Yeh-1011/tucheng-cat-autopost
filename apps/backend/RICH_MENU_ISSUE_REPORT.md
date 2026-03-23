# LINE Rich Menu 顯示問題完整報告

## 問題描述

Rich Menu 已經成功部署並設定為預設，但在 LINE 聊天室中仍然看不到。

## 環境資訊

### LINE Channel 資訊（已修正）
- **Channel ID**: `2008557763` ✅ 正確
- **LIFF ID**: `2008612222-PgzW5BGy` ✅ 正確
- **LIFF URL**: `https://liff.line.me/2008612222-PgzW5BGy` ✅ 正確

### 環境變數（本地 .env 檔案）
- `LINE_CHANNEL_ACCESS_TOKEN`: 已設定（長度約 200+ 字元）
- `LINE_CHANNEL_ID`: `2008557763` ✅ 已修正
- `LINE_CHANNEL_SECRET`: `eb957957c893c8729d04c7fd61124669`
- `LIFF_ID`: `2008612222-PgzW5BGy` ✅ 已修正
- `LIFF_URL`: `https://liff.line.me/2008612222-PgzW5BGy` ✅ 已修正

### ⚠️ 問題根源
**之前使用了錯誤的 Channel ID 和 LIFF ID**（可能是其他專案的資訊）：
- ❌ 錯誤的 Channel ID: `2008323255`
- ❌ 錯誤的 LIFF ID: `2008324372-R124geaz`
- ✅ 正確的 Channel ID: `2008557763`
- ✅ 正確的 LIFF ID: `2008612222-PgzW5BGy`

## 已完成的部署步驟

### ✅ 步驟 1：建立 .env 檔案
- 位置：`apps/backend/.env`
- 包含所有 LINE 相關環境變數

### ✅ 步驟 2：生成 Rich Menu 圖片
- 執行：`npm run rich-menu:generate`
- 結果：成功生成 `rich-menu-dashboard.png`
- 圖片尺寸：2500 x 1686 像素

### ✅ 步驟 3：部署 Rich Menu
執行腳本：`npm run rich-menu:generate`
- ✅ Rich Menu 已建立
- ✅ 圖片已上傳
- ✅ 已設定為預設 Rich Menu

**初次部署結果（使用錯誤的 Channel ID）：**
```
📱 Rich Menu ID: richmenu-c83243916e1300d5683bd02bd34aab25
✅ Rich Menu 已建立，ID: richmenu-c83243916e1300d5683bd02bd34aab25
✅ 圖片已上傳
✅ 已設定為預設 Rich Menu
🎉 Rich Menu 部署完成！
```

**重新部署結果（使用正確的 Channel ID）：**
```
📱 使用 LIFF URL: https://liff.line.me/2008612222-PgzW5BGy ✅
📱 Rich Menu ID: richmenu-b9620923e8a7097e812dd6a7b02bd147
✅ Rich Menu 已建立，ID: richmenu-b9620923e8a7097e812dd6a7b02bd147
✅ 圖片已上傳
✅ 已設定為預設 Rich Menu
🎉 Rich Menu 部署完成！
```

## 診斷結果

### 1. Token 驗證
- ✅ **Token 有效**
- ✅ 可以成功呼叫 LINE API
- ✅ Bot 名稱：`MGM-RMS 測試`

### 2. Rich Menu 列表
- ✅ **找到 6 個 Rich Menu**
- ✅ 目標 Rich Menu 存在：`richmenu-c83243916e1300d5683bd02bd34aab25`
- ✅ 名稱：`土城浪貓主選單`
- ✅ 狀態：`selected: true`（可以設定為預設）

### 3. 預設 Rich Menu 設定
- ✅ **已設定為預設**
- ✅ 預設 Rich Menu ID：`richmenu-c83243916e1300d5683bd02bd34aab25`
- ✅ 確認 API 返回正確的預設 ID

### 4. Rich Menu 詳細資訊
目標 Rich Menu 包含 6 個按鈕：
1. 編輯器 - `https://liff.line.me/2008324372-R124geaz/editor`
2. 我的草稿 - `https://liff.line.me/2008324372-R124geaz/drafts`
3. 生成草稿 - `https://liff.line.me/2008324372-R124geaz/generate`
4. 主選單 - `https://liff.line.me/2008324372-R124geaz/dashboard`
5. 關於 - `https://liff.line.me/2008324372-R124geaz/about`
6. 聯絡 - `https://liff.line.me/2008324372-R124geaz/contact`

## 發現的其他 Rich Menu

系統中存在 6 個 Rich Menu，其中 2 個標記為 `selected: true`：

1. **HQ Menu** (`richmenu-fa743bc68f557e875e419cc15da11267`)
   - `selected: false`

2. **Vendor Menu** (`richmenu-538072104282af1cdfbc6f8528c31ef0`)
   - `selected: false`

3. **土城浪貓主選單** (`richmenu-c83243916e1300d5683bd02bd34aab25`) ⭐ 目標
   - `selected: true`
   - `chatBarText: "選單"`

4. **Engineer Menu** (`richmenu-07345844d5b8589646e2cedcbfa9750a`)
   - `selected: false`

5. **L1 Landing Menu** (`richmenu-77346c228cb3419a92b2c2b905e792f9`)
   - `selected: true` ⚠️ **可能衝突**
   - `chatBarText: "開始使用"`

6. **Manager Menu** (`richmenu-90b5495385e8ea7d72f0fbce00558c62`)
   - `selected: false`

## 已嘗試的解決方案

### ✅ 嘗試 1：重新設定預設 Rich Menu
```powershell
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu/richmenu-c83243916e1300d5683bd02bd34aab25" `
  -Method Post `
  -Headers @{ "Authorization" = "Bearer $token" }
```
結果：✅ 成功設定

### ✅ 嘗試 2：驗證預設 Rich Menu
```powershell
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```
結果：✅ 返回正確的 Rich Menu ID

### ❌ 嘗試 3：等待同步
- 等待超過 10 分鐘
- 重新開啟 LINE 應用程式
- 重新開啟聊天室
結果：❌ 仍然看不到

## 可能的問題原因

### 1. ⚠️ **多個 Rich Menu 衝突**
- `L1 Landing Menu` 也標記為 `selected: true`
- 可能導致 LINE 無法確定顯示哪個

### 2. ⚠️ **用戶特定的 Rich Menu 連結**
- 如果用戶之前被連結到特定 Rich Menu（如 "L1 Landing Menu"）
- 預設 Rich Menu 不會覆蓋用戶特定的連結

### 3. ⚠️ **Rich Menu 圖片問題**
- 雖然已上傳，但可能圖片格式或內容有問題
- 需要驗證圖片是否可正常顯示

### 4. ⚠️ **LIFF URL 設定問題**
- LIFF URL 是否正確註冊
- LIFF 應用是否正常運作

### 5. ⚠️ **LINE 應用程式快取**
- LINE 應用程式可能快取了舊的 Rich Menu
- 需要清除快取或重新安裝

## API 端點狀態

### 後端 API
- **Base URL**: `https://tucheng-cat-autopost.onrender.com`
- ✅ `/line/rich-menu` - 取得 Rich Menu 列表
- ✅ `/line/rich-menu/default` - 建立預設 Rich Menu
- ✅ `/line/rich-menu/{id}/image` - 上傳圖片
- ✅ `/line/rich-menu/{id}/set-default` - 設定為預設

### LINE API
- ✅ `GET /v2/bot/info` - Token 有效
- ✅ `GET /v2/bot/richmenu/list` - 可取得列表
- ✅ `POST /v2/bot/user/all/richmenu/{id}` - 可設定預設
- ✅ `GET /v2/bot/user/all/richmenu` - 可取得預設 ID

## 需要進一步檢查的項目

### 1. 檢查 Render 環境變數
- [ ] `LINE_CHANNEL_ACCESS_TOKEN` 是否在 Render Dashboard 設定？
- [ ] `LIFF_URL` 是否在 Render Dashboard 設定？
- [ ] 環境變數是否正確同步？

### 2. 檢查用戶特定的 Rich Menu 連結
```powershell
# 需要用戶的 LINE User ID
# 可以從 webhook 事件取得
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/{userId}/richmenu" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```

### 3. 檢查 Rich Menu 圖片
```powershell
# 檢查圖片是否可正常下載
$imageUrl = "https://api-data.line.me/v2/bot/richmenu/richmenu-c83243916e1300d5683bd02bd34aab25/content"
Invoke-RestMethod -Uri $imageUrl `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```

### 4. 檢查 LIFF 應用狀態
- [ ] LIFF 應用是否正常部署？
- [ ] LIFF URL 是否可以正常訪問？
- [ ] LIFF 應用中的路由是否正確設定？

## 建議的解決方案

### 方案 1：刪除衝突的 Rich Menu
刪除 `L1 Landing Menu` 或其他衝突的 Rich Menu，只保留目標 Rich Menu。

### 方案 2：檢查用戶特定的連結
確認測試用戶是否被連結到特定的 Rich Menu，如果是，需要取消連結。

### 方案 3：重新部署
1. 刪除現有的 Rich Menu
2. 重新建立並部署
3. 確保只有一個預設 Rich Menu

### 方案 4：檢查 LINE Developers Console
1. 確認 Rich Menu 在 LINE Developers Console 中的狀態
2. 檢查是否有任何限制或錯誤訊息

## 相關檔案

- 環境變數：`apps/backend/.env`
- 部署腳本：`apps/backend/src/scripts/generate-rich-menu.ts`
- 圖片檔案：`apps/backend/rich-menu-dashboard.png`
- 診斷文件：`apps/backend/rich-menu-troubleshooting.md`

## 技術細節

### 使用的技術
- **LINE Bot SDK**: `@line/bot-sdk@^10.5.0`
- **生成工具**: Puppeteer
- **部署方式**: 直接呼叫 LINE API

### 部署命令
```bash
cd apps/backend
npm run rich-menu:generate
```

## 當前狀態總結

✅ **部署成功**
- Rich Menu 已建立
- 圖片已上傳
- 已設定為預設

❌ **顯示失敗**
- 在 LINE 聊天室中看不到 Rich Menu
- 所有 API 呼叫都成功
- Token 驗證通過

⚠️ **可能的問題**
- 多個 Rich Menu 衝突
- 用戶特定的連結
- LINE 同步問題

## 下一步行動

1. **檢查 Render Dashboard** 的環境變數設定
2. **檢查用戶特定的 Rich Menu 連結**
3. **驗證 LIFF 應用**是否正常運作
4. **考慮刪除衝突的 Rich Menu**
5. **聯繫 LINE 支援**（如果所有方法都失敗）

## 關鍵問題

**為什麼 LINE API 顯示 Rich Menu 已設定為預設，但在 LINE 應用程式中看不到？**

### 🔍 根本原因（已發現）

**使用了錯誤的 Channel ID 和 LIFF ID！**

- ❌ 之前使用的錯誤資訊（可能是其他專案的資訊）：
  - Channel ID: `2008323255`（錯誤）
  - LIFF ID: `2008324372-R124geaz`（錯誤）
  
- ✅ 正確的資訊：
  - Channel ID: `2008557763`
  - LIFF ID: `2008612222-PgzW5BGy`
  - LIFF URL: `https://liff.line.me/2008612222-PgzW5BGy`

### ✅ 解決方案（已執行）

1. ✅ 更新 `.env` 檔案中的正確 Channel ID 和 LIFF ID
2. ✅ 使用正確的資訊重新部署 Rich Menu
3. ✅ 新的 Rich Menu ID: `richmenu-b9620923e8a7097e812dd6a7b02bd147`
4. ✅ 使用正確的 LIFF URL 部署

### 📝 下一步

請等待 1-5 分鐘讓 LINE 同步，然後：
1. 完全關閉並重新開啟 LINE 應用程式
2. 重新開啟與官方帳號的聊天室

應該就能看到 Rich Menu 了！

