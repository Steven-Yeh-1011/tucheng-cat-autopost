# Vercel Root Directory 問題快速解決

## 當前情況

您在 Vercel 的 Root Directory 選擇器中：
- ✅ 可以看到 `apps` 目錄
- ✅ 可以看到 `backend` 目錄
- ❌ 看不到 `liff-editor` 目錄
- ❌ 沒有手動輸入路徑的欄位

## 解決方案

### 方案一：刷新 Vercel 並重新匯入（推薦）

1. **取消當前設定**：
   - 點擊「**Cancel**」關閉 Root Directory 選擇器
   - 或關閉整個專案建立頁面

2. **刷新 Vercel**：
   - 在 Vercel Dashboard 中，找到您的專案
   - 點擊「**Settings**」→「**Git**」
   - 點擊「**Disconnect**」然後重新連接
   - 或直接刪除專案，重新建立

3. **重新匯入倉庫**：
   - 點擊「**Add New...**」→「**Project**」
   - 重新選擇 `Steven-Yeh-1011/tucheng-cat-autopost`
   - 這次應該可以看到 `liff-editor`

### 方案二：先選擇 apps，稍後調整

如果急需部署：

1. **在 Root Directory 選擇器中**：
   - 選擇 `apps` 目錄（不是 `backend`）
   - 點擊「**Continue**」

2. **在後續設定中**：
   - 可能需要手動指定子目錄
   - 或在 Build Settings 中調整路徑

3. **或建立兩個專案**：
   - 第一個專案：選擇 `apps/backend`（後端，雖然不推薦）
   - 第二個專案：選擇 `apps/liff-editor`（前端）

### 方案三：等待 GitHub 同步

1. **確認 GitHub 已更新**：
   - 前往：https://github.com/Steven-Yeh-1011/tucheng-cat-autopost/tree/main/apps
   - 確認可以看到 `liff-editor` 目錄
   - 如果看不到，等待幾分鐘讓 GitHub 同步

2. **在 Vercel 中刷新**：
   - 點擊頁面重新整理（F5）
   - 或取消並重新開啟 Root Directory 選擇器

### 方案四：暫時部署後端，稍後部署前端

如果 `liff-editor` 確實還沒出現：

1. **先完成後端部署**：
   - 選擇 `apps/backend`
   - 完成部署設定
   - 部署後端到 Vercel（雖然不推薦，但可以測試）

2. **稍後部署前端**：
   - 確認 GitHub 更新後
   - 建立新的 Vercel 專案
   - 選擇 `apps/liff-editor`

## 檢查 GitHub 狀態

請先確認 GitHub 上是否有 `liff-editor`：

1. 前往：https://github.com/Steven-Yeh-1011/tucheng-cat-autopost/tree/main/apps
2. 應該看到兩個目錄：
   - `backend/`
   - `liff-editor/` ← 確認這個存在

3. 如果沒有，執行：
   ```bash
   git push origin main
   ```

## 推薦操作順序

1. ✅ **確認 GitHub 已更新**（最重要）
2. ✅ **在 Vercel 中取消當前設定**
3. ✅ **重新整理 Vercel 頁面**
4. ✅ **重新匯入倉庫**
5. ✅ **再次開啟 Root Directory 選擇器**
6. ✅ **應該可以看到 `liff-editor`**

## 如果仍然看不到

可能需要：
1. 等待幾分鐘讓 Vercel 同步 GitHub
2. 或聯繫 Vercel 支援
3. 或使用方案四，先部署後端

---

**建議**：先確認 GitHub 上是否有 `liff-editor` 目錄，然後在 Vercel 中重新整理或重新匯入。

