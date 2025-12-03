# Dashboard 顯示問題排查指南

## 問題：在 LINE 中打開 LIFF 應用時看不到 Dashboard

## 排查步驟

### 1. 檢查 LIFF URL 配置

確認 LINE Developers Console 中的 LIFF URL 是否正確設定：

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇您的 Provider 和 Channel
3. 進入「LIFF」頁籤
4. 檢查 LIFF URL 是否指向您的 Vercel 部署網址

**正確格式**：
```
https://your-app.vercel.app
```

**錯誤格式**：
```
https://your-app.vercel.app/editor  ❌
https://your-app.vercel.app/dashboard  ❌
```

### 2. 檢查 Middleware 是否正常工作

Middleware 會在服務端自動將 LINE 用戶從首頁重定向到 Dashboard。

**測試方法**：
1. 在瀏覽器中打開 LIFF URL（模擬 LINE 環境）
2. 檢查 Network 標籤，應該看到 307/308 重定向到 `/dashboard`
3. 或者直接訪問 `https://your-app.vercel.app/dashboard` 確認頁面存在

### 3. 檢查 User Agent 檢測

Middleware 會檢查以下條件來判斷是否在 LINE 環境中：

- User Agent 包含 `Line` 或 `LINE`
- Referer 包含 `liff.line.me` 或 `line.me`
- URL 包含 `liff.line.me` 或 `line.me`
- URL 參數包含 `liff.state`

**手動測試**：
在瀏覽器開發者工具中，修改 User Agent 為：
```
Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 Line/11.0.0
```

然後訪問首頁，應該會自動重定向到 Dashboard。

### 4. 檢查 Dashboard 頁面是否存在

確認以下檔案存在：
- `apps/liff-editor/app/dashboard/page.tsx`
- `apps/liff-editor/middleware.ts`

### 5. 檢查部署狀態

確認 Vercel 部署是否成功：

1. 前往 Vercel Dashboard
2. 檢查最新部署是否成功
3. 查看部署日誌是否有錯誤

### 6. 清除快取

如果之前訪問過 LIFF 應用，瀏覽器或 LINE 可能快取了舊版本：

1. 在 LINE 中長按 LIFF 連結
2. 選擇「清除快取」或「重新載入」
3. 或者使用無痕模式測試

### 7. 直接訪問 Dashboard

如果重定向不工作，可以暫時直接設定 LIFF URL 為：
```
https://your-app.vercel.app/dashboard
```

但這不是最佳實踐，應該讓 middleware 處理重定向。

## 常見問題

### Q: 為什麼在瀏覽器中直接訪問首頁不會重定向？

A: Middleware 只會在檢測到 LINE User Agent 時才重定向。在一般瀏覽器中訪問不會觸發重定向。

### Q: 如何確認 Middleware 是否執行？

A: 在 Vercel 的 Function Logs 中查看，或者添加 console.log 到 middleware.ts 中。

### Q: Dashboard 頁面顯示但樣式不對？

A: 檢查 Tailwind CSS 是否正確編譯，確認 `globals.css` 已正確導入。

### Q: 點擊 Dashboard 卡片沒有反應？

A: 檢查 Next.js router 是否正常工作，確認 `useRouter` 已正確導入。

## 調試代碼

如果問題持續，可以在 Dashboard 頁面添加調試信息：

```typescript
// apps/liff-editor/app/dashboard/page.tsx
export default function DashboardPage() {
  useEffect(() => {
    console.log('Dashboard loaded');
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
  }, []);
  
  // ... rest of component
}
```

## 聯繫支援

如果以上步驟都無法解決問題，請提供：
1. LINE User Agent（在 Dashboard 頁面的 console 中查看）
2. Vercel 部署日誌
3. 瀏覽器 Network 標籤的截圖
4. 具體的錯誤訊息

