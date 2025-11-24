# 推送到 GitHub 指南

## 快速推送步驟

### 1. 在 GitHub 建立新倉庫

前往 https://github.com/new 建立新倉庫：
- 名稱：`tucheng-cat-autopost`
- 設為 Private（建議）
- **不要** 初始化 README、.gitignore 或 license

### 2. 連接遠端倉庫並推送

在專案根目錄執行以下命令（替換 `YOUR_USERNAME` 為您的 GitHub 用戶名）：

```bash
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/tucheng-cat-autopost.git

# 或使用 SSH（如果您已設定 SSH 金鑰）
# git remote add origin git@github.com:YOUR_USERNAME/tucheng-cat-autopost.git

# 推送所有分支
git push -u origin main
git push -u origin develop
git push -u origin render-web-service
git push -u origin render-cron-jobs
```

### 3. 驗證推送結果

前往您的 GitHub 倉庫頁面，確認：
- ✅ 所有檔案都已上傳
- ✅ 所有分支都已建立
- ✅ `render.yaml` 檔案存在

## 分支說明

推送後，您將有以下分支：

| 分支 | 用途 | Render 服務 |
|------|------|-------------|
| `main` | 生產環境主分支 | Web Service + Cron Jobs |
| `develop` | 開發分支 | - |
| `render-web-service` | Web Service 配置 | Web Service |
| `render-cron-jobs` | Cron Jobs 配置 | Cron Jobs |

## 下一步：在 Render 部署

1. 前往 Render Dashboard: https://dashboard.render.com
2. 選擇 **New** → **Blueprint**
3. 連接您的 GitHub 倉庫
4. Render 會自動讀取 `render.yaml` 並建立所有服務

詳細說明請參考 `DEPLOYMENT.md` 和 `GITHUB_SETUP.md`

## 常見問題

### Q: 推送時要求輸入認證資訊？
A: 使用 Personal Access Token (PAT) 或設定 SSH 金鑰

### Q: 如何更新遠端倉庫 URL？
A: 
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/tucheng-cat-autopost.git
```

### Q: 如何查看遠端倉庫設定？
A:
```bash
git remote -v
```

