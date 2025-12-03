# Dashboard 無法顯示 - 完整排查指南

## 立即檢查項目

### 1. 確認 Dashboard 頁面可以直接訪問

在瀏覽器中直接訪問：
```
https://your-liff-app.vercel.app/dashboard
```

**如果可以直接訪問**：
- ✅ Dashboard 頁面本身沒問題
- ❌ 問題在於重定向邏輯

**如果無法訪問**：
- ❌ Dashboard 頁面可能有問題
- 檢查 Vercel 部署日誌

### 2. 檢查 Vercel 環境變數

在 **Vercel Dashboard** → **Project Settings** → **Environment Variables** 確認：

- [ ] `NEXT_PUBLIC_BACKEND_URL` = `https://tucheng-cat-autopost-backend.onrender.com`

**重要**：環境變數修改後需要重新部署！

### 3. 檢查 Vercel 部署日誌

1. 前往 Vercel Dashboard
2. 選擇最新部署
3. 查看 **Build Logs** 和 **Function Logs**
4. 查找 `[Middleware]` 相關日誌

### 4. 在 LINE 中測試並查看 Console

如果可能，在 LINE 中打開 LIFF 應用後：

1. 打開瀏覽器開發者工具（如果可能）
2. 查看 Console 標籤
3. 應該會看到：
   - `[Client Redirect] Detected LINE environment, redirecting to Dashboard`
   - 或 `=== Dashboard Debug Info ===`

### 5. 檢查 LIFF URL 配置

在 **LINE Developers Console** 中確認：

1. LIFF URL 應該指向：`https://your-liff-app.vercel.app`
2. **不要**指向 `/dashboard` 或其他路徑
3. Size 應該是 `Full`

## 臨時解決方案

如果重定向一直不工作，可以暫時直接設定 LIFF URL 為 Dashboard：

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇您的 Channel
3. 進入 **LIFF** 頁籤
4. 編輯 LIFF 應用
5. 將 **LIFF URL** 改為：`https://your-liff-app.vercel.app/dashboard`
6. 儲存

**注意**：這只是臨時方案，建議修復重定向邏輯後改回根路徑。

## 測試步驟

### 測試 1：直接訪問 Dashboard
```bash
curl -I https://your-liff-app.vercel.app/dashboard
```
應該返回 `200 OK`

### 測試 2：模擬 LINE User Agent
```bash
curl -H "User-Agent: Line/11.0.0" -I https://your-liff-app.vercel.app/
```
應該返回 `307 Redirect` 到 `/dashboard`

### 測試 3：檢查 Middleware 日誌
在 Vercel Dashboard 的 **Function Logs** 中查看是否有：
```
[Middleware] Pathname: /
[Middleware] User Agent: ...
[Middleware] Is in LINE: true
[Middleware] Redirecting to: ...
```

## 如果還是不行

請提供以下信息：

1. **Vercel 部署日誌**（特別是 Function Logs）
2. **瀏覽器 Console 輸出**（如果可能）
3. **直接訪問 Dashboard 的結果**（`/dashboard` 是否可以訪問）
4. **LIFF URL 配置**（在 LINE Developers Console 中的設定）

## 最簡單的解決方案

如果所有方法都不行，可以考慮：

1. **將首頁直接改為 Dashboard 內容**（不重定向）
2. **或者將 LIFF URL 直接設定為 `/dashboard`**

讓我知道您想要哪種方案，我可以幫您實作。

