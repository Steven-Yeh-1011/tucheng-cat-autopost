# 分支策略說明

本專案使用以下分支結構來管理 Render 部署：

## 分支說明

### main
- **用途**: 生產環境主分支
- **部署**: Render Web Service + Cron Jobs (完整部署)
- **保護**: 建議設定為受保護分支，需要 PR 審核

### develop
- **用途**: 開發分支
- **部署**: 開發環境（可選）
- **合併**: 功能開發完成後合併到此分支

### render-web-service
- **用途**: Web Service 相關配置與優化
- **重點**: 
  - Backend API 端點
  - LINE Webhook 處理
  - 環境變數配置
  - 效能優化

### render-cron-jobs
- **用途**: Cron Jobs 相關配置與優化
- **重點**:
  - 排程任務邏輯
  - 清理任務
  - Cron 表達式調整
  - 任務監控與日誌

## 工作流程

### 開發新功能
1. 從 `develop` 建立功能分支
2. 開發完成後建立 PR 到 `develop`
3. 測試通過後合併到 `develop`
4. 定期將 `develop` 合併到 `main`

### 部署到 Render

#### 方法一：使用 render.yaml (推薦)
- 所有服務配置都在 `render.yaml`
- 直接從 `main` 分支部署
- Render 會自動讀取配置並建立所有服務

#### 方法二：分別部署
- Web Service: 從 `render-web-service` 或 `main` 部署
- Cron Jobs: 從 `render-cron-jobs` 或 `main` 部署

## 分支維護

### 定期同步
```bash
# 將 main 的更新同步到其他分支
git checkout develop
git merge main

git checkout render-web-service
git merge main

git checkout render-cron-jobs
git merge main
```

### 建立新分支
```bash
# 從 develop 建立功能分支
git checkout develop
git checkout -b feature/your-feature-name
```

## 注意事項

1. **render.yaml**: 包含所有服務配置，建議在 `main` 分支維護
2. **環境變數**: 各分支可能需要不同的環境變數設定
3. **資料庫 Migration**: 應在 `main` 分支執行，確保所有環境一致
4. **測試**: 部署前應在對應分支進行測試

