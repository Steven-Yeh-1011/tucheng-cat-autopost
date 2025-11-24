# GitHub 倉庫設定指南

## 建立 GitHub 倉庫

### 1. 在 GitHub 建立新倉庫

1. 登入 GitHub
2. 點擊右上角 "+" → "New repository"
3. 設定：
   - **Repository name**: `tucheng-cat-autopost`
   - **Description**: `土城貓舍自動發文系統 - 自動化社群媒體發文系統`
   - **Visibility**: Private (建議) 或 Public
   - **不要** 初始化 README、.gitignore 或 license（我們已經有了）

### 2. 連接本地倉庫

```bash
# 在專案根目錄執行
cd C:\Users\diowy\tucheng-cat-autopost

# 添加遠端倉庫（替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/tucheng-cat-autopost.git

# 或使用 SSH
git remote add origin git@github.com:YOUR_USERNAME/tucheng-cat-autopost.git
```

### 3. 推送所有分支

```bash
# 推送 main 分支
git push -u origin main

# 推送其他分支
git push -u origin develop
git push -u origin render-web-service
git push -u origin render-cron-jobs
```

### 4. 設定分支保護規則（可選但建議）

在 GitHub 倉庫設定中：

1. 前往 **Settings** → **Branches**
2. 為 `main` 分支新增規則：
   - ✅ Require a pull request before merging
   - ✅ Require approvals (建議至少 1 個)
   - ✅ Require status checks to pass before merging

## 分支結構

推送後，您的 GitHub 倉庫將有以下分支：

```
main                    # 生產環境主分支
├── develop            # 開發分支
├── render-web-service # Web Service 配置分支
└── render-cron-jobs  # Cron Jobs 配置分支
```

## 連接 Render

### 使用 render.yaml (推薦)

1. 在 Render Dashboard 選擇 **New** → **Blueprint**
2. 連接您的 GitHub 倉庫
3. 選擇 `main` 分支
4. Render 會自動讀取 `render.yaml` 並建立所有服務

### 手動建立服務

如果需要分別建立服務：

#### Web Service
1. **New** → **Web Service**
2. 連接 GitHub 倉庫
3. 選擇分支：`main` 或 `render-web-service`
4. 按照 `DEPLOYMENT.md` 設定

#### Cron Jobs
1. **New** → **Cron Job**
2. 連接 GitHub 倉庫
3. 選擇分支：`main` 或 `render-cron-jobs`
4. 按照 `DEPLOYMENT.md` 設定

## 持續部署

設定完成後：

- **自動部署**: 當您推送代碼到 `main` 分支時，Render 會自動重新部署
- **手動部署**: 可在 Render Dashboard 手動觸發部署
- **預覽部署**: 可以為其他分支建立預覽環境

## 環境變數管理

### 在 Render 設定環境變數

1. 前往服務的 **Environment** 頁面
2. 添加所有必要的環境變數（參考 `DEPLOYMENT.md`）
3. 使用 **Secret Files** 管理敏感資訊

### 同步環境變數

Render 的 `render.yaml` 中設定了 `sync: false` 的變數需要手動設定：

- `DATABASE_URL`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_USER_ID`
- `OPENAI_API_KEY`
- `META_ACCESS_TOKEN`
- `META_PAGE_ID`
- `META_IG_ACCOUNT_ID`

## 監控與日誌

- **日誌**: 在 Render Dashboard 查看即時日誌
- **指標**: 監控 CPU、記憶體使用量
- **告警**: 設定告警通知（Email、Slack 等）

## 故障排除

### 部署失敗

1. 檢查建置日誌中的錯誤訊息
2. 確認環境變數是否正確設定
3. 檢查 `render.yaml` 語法是否正確
4. 確認資料庫連接是否正常

### Cron Job 未執行

1. 檢查 Cron 排程設定
2. 查看 Cron Job 的執行日誌
3. 確認 `WEB_SERVICE_URL` 環境變數是否正確
4. 測試手動觸發是否正常

## 下一步

1. ✅ 推送代碼到 GitHub
2. ✅ 在 Render 建立服務
3. ✅ 設定環境變數
4. ✅ 執行資料庫 Migration
5. ✅ 測試 API 端點
6. ✅ 設定 LINE Webhook URL
7. ✅ 測試 Cron Jobs

