# Vercel 部署問題排除

## 問題：在 Root Directory 選擇器中看不到 `liff-editor`

### 原因分析

1. **GitHub 倉庫未更新**：`liff-editor` 檔案可能還沒有推送到 GitHub
2. **Vercel 快取**：Vercel 可能還在讀取舊的倉庫狀態
3. **目錄結構問題**：檔案可能沒有正確提交到 Git

### 解決方法

#### 方法一：確認 GitHub 倉庫已更新

1. **檢查本地檔案**：
   ```bash
   cd C:\Users\diowy\tucheng-cat-autopost
   git status
   ```

2. **確認 liff-editor 已提交**：
   ```bash
   git ls-files apps/liff-editor | Select-Object -First 5
   ```

3. **推送到 GitHub**：
   ```bash
   git add apps/liff-editor/
   git commit -m "Add liff-editor files"
   git push origin main
   ```

4. **驗證 GitHub**：
   - 前往：https://github.com/Steven-Yeh-1011/tucheng-cat-autopost/tree/main/apps
   - 確認可以看到 `liff-editor` 目錄

#### 方法二：在 Vercel 中刷新

1. 在 Vercel 專案設定頁面
2. 點擊「**Refresh**」或「**重新掃描**」按鈕
3. 或取消當前匯入，重新匯入倉庫

#### 方法三：手動輸入路徑

如果目錄選擇器中沒有顯示，可以：

1. 在 Root Directory 欄位中
2. 直接輸入：`apps/liff-editor`
3. 點擊「**Continue**」

#### 方法四：先選擇 apps，再設定

1. 在 Root Directory 選擇器中
2. 選擇 `apps` 目錄
3. 點擊「**Continue**」
4. 在後續設定中，可能需要額外指定子目錄

### 臨時解決方案：部署後端到 Vercel

如果暫時無法看到 `liff-editor`，您可以：

1. **先部署後端**（雖然不推薦，但可以測試）：
   - 選擇 `apps/backend`
   - Framework: `NestJS`
   - 完成部署

2. **稍後再部署前端**：
   - 確認 GitHub 倉庫更新後
   - 建立新的 Vercel 專案
   - 選擇 `apps/liff-editor`

### 檢查清單

在 Vercel 中選擇 Root Directory 前，確認：

- [ ] GitHub 倉庫中有 `apps/liff-editor` 目錄
- [ ] `apps/liff-editor` 中有 `package.json`
- [ ] `apps/liff-editor` 中有 `next.config.ts` 或 `next.config.js`
- [ ] 已推送最新變更到 GitHub
- [ ] 在 Vercel 中刷新了倉庫

### 驗證步驟

1. **檢查 GitHub**：
   ```
   https://github.com/Steven-Yeh-1011/tucheng-cat-autopost/tree/main/apps/liff-editor
   ```

2. **檢查檔案是否存在**：
   - 應該看到 `package.json`
   - 應該看到 `app/` 目錄
   - 應該看到 `components/` 目錄

3. **如果 GitHub 上沒有**：
   - 需要先推送檔案
   - 參考「方法一」的步驟

### 如果仍然無法解決

1. **檢查 .gitignore**：
   - 確認 `apps/liff-editor` 沒有被忽略

2. **檢查 Git 狀態**：
   ```bash
   git status apps/liff-editor/
   ```

3. **強制添加**：
   ```bash
   git add -f apps/liff-editor/
   git commit -m "Force add liff-editor"
   git push origin main
   ```

4. **聯繫支援**：
   - 如果問題持續，可能需要檢查 Vercel 的倉庫連接設定

