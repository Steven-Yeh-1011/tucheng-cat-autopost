# 推送代碼到 GitHub 的完整步驟

## 步驟 1: 在 GitHub 建立新倉庫

1. 前往 https://github.com/new
2. 填寫以下資訊：
   - **Repository name**: `tucheng-cat-autopost`
   - **Description**: `土城貓舍自動發文系統 - 自動化社群媒體發文系統`
   - **Visibility**: 選擇 **Private**（建議）或 **Public**
   - ⚠️ **重要**: **不要**勾選以下選項：
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
3. 點擊 **Create repository**

## 步驟 2: 確認或更新遠端 URL

如果您的 GitHub 用戶名不是 `diowyang1011`，請先更新遠端 URL：

```bash
# 移除現有的遠端
git remote remove origin

# 添加正確的遠端（替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/tucheng-cat-autopost.git
```

## 步驟 3: 推送所有分支

在專案根目錄執行：

```bash
# 推送 main 分支
git push -u origin main

# 推送其他分支
git push -u origin develop
git push -u origin render-web-service
git push -u origin render-cron-jobs
```

## 步驟 4: 驗證推送結果

前往您的 GitHub 倉庫頁面確認：
- ✅ 所有檔案都已上傳
- ✅ 所有分支都已建立（main, develop, render-web-service, render-cron-jobs）
- ✅ `render.yaml` 檔案存在

## 如果遇到認證問題

### 使用 Personal Access Token (PAT)

1. 前往 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 生成新 token，勾選 `repo` 權限
3. 推送時使用 token 作為密碼：
   ```bash
   # 用戶名：您的 GitHub 用戶名
   # 密碼：您的 Personal Access Token
   ```

### 或使用 SSH

```bash
# 移除 HTTPS 遠端
git remote remove origin

# 添加 SSH 遠端
git remote add origin git@github.com:YOUR_USERNAME/tucheng-cat-autopost.git
```

## 完成後

推送完成後，您就可以：
1. 在 Render Dashboard 連接 GitHub 倉庫
2. 使用 Blueprint 自動部署所有服務
3. 參考 `DEPLOYMENT.md` 進行後續設定

