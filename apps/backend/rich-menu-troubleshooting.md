# Rich Menu 顯示問題診斷與解決

## 當前狀態確認

✅ **Rich Menu 已成功部署**
- Rich Menu ID: `richmenu-c83243916e1300d5683bd02bd34aab25`
- 名稱: 土城浪貓主選單
- 圖片已上傳
- 已設定為預設 Rich Menu

## 為什麼還是看不到？

### 可能原因與解決方案

#### 1. **LINE 同步延遲** ⏱️
LINE 需要時間同步 Rich Menu，通常需要 **1-5 分鐘**。

**解決方案：**
- 等待 5 分鐘
- 完全關閉並重新開啟 LINE 應用程式
- 重新開啟與官方帳號的聊天室

#### 2. **用戶已連結到其他 Rich Menu** 🔗
如果用戶之前被連結到特定的 Rich Menu（例如 "L1 Landing Menu"），預設 Rich Menu 不會覆蓋用戶特定的連結。

**檢查方法：**
```powershell
# 需要用戶的 LINE User ID
# 可以從 webhook 事件或 LINE 開發者工具取得
```

**解決方案：**
- 取消用戶特定的 Rich Menu 連結，然後預設 Rich Menu 才會顯示
- 或為用戶重新連結到新的 Rich Menu

#### 3. **Rich Menu 未正確設定為預設** ⚠️
雖然已設定，但可能需要確認。

**確認方法：**
```powershell
$token = $env:LINE_CHANNEL_ACCESS_TOKEN
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
```

應該返回：`richmenu-c83243916e1300d5683bd02bd34aab25`

#### 4. **LINE 應用程式快取問題** 📱
LINE 應用程式可能快取了舊的 Rich Menu。

**解決方案：**
- 清除 LINE 應用程式快取
- 重新安裝 LINE 應用程式（最後手段）
- 使用其他裝置測試

#### 5. **Rich Menu 圖片問題** 🖼️
雖然已上傳，但圖片可能有問題。

**檢查方法：**
訪問以下 URL 查看 Rich Menu 圖片：
```
https://api-data.line.me/v2/bot/richmenu/richmenu-c83243916e1300d5683bd02bd34aab25/content
```

需要 Authorization header: `Bearer YOUR_TOKEN`

## 立即檢查步驟

### 步驟 1：確認預設 Rich Menu
```powershell
$token = $env:LINE_CHANNEL_ACCESS_TOKEN
$defaultId = Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
Write-Host "預設 Rich Menu ID: $($defaultId.richMenuId)"
```

### 步驟 2：檢查所有 Rich Menu
```powershell
$token = $env:LINE_CHANNEL_ACCESS_TOKEN
$richMenus = Invoke-RestMethod -Uri "https://api.line.me/v2/bot/richmenu/list" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }
$richMenus.richmenus | Where-Object { $_.selected -eq $true } | Format-Table richMenuId, name, selected
```

### 步驟 3：重新設定預設 Rich Menu
```powershell
$token = $env:LINE_CHANNEL_ACCESS_TOKEN
$richMenuId = "richmenu-c83243916e1300d5683bd02bd34aab25"

# 設定為預設
Invoke-RestMethod -Uri "https://api.line.me/v2/bot/user/all/richmenu/$richMenuId" `
  -Method Post `
  -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "✅ 已重新設定為預設"
```

## 重要提醒

1. **新用戶**：會自動看到預設 Rich Menu
2. **現有用戶**：
   - 如果之前沒有連結到特定 Rich Menu：會看到預設 Rich Menu
   - 如果之前連結到特定 Rich Menu：需要取消連結或重新連結

## 如果仍然無效

請提供以下資訊：
1. LINE 應用程式版本
2. 裝置類型（iOS/Android）
3. 是否是新用戶還是現有用戶
4. 之前是否看到過其他 Rich Menu
5. 執行上述檢查步驟的結果

