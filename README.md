# 土城浪貓自動發文系統

> 自動化管理 LINE Rich Menu 和社群媒體發文的系統

---

## 🚨 重要文檔

### ⚠️ 必讀！避免重複錯誤

- **[LESSONS_LEARNED.md](./LESSONS_LEARNED.md)** 🔴 **絕對必讀**
  - 記錄所有錯誤和教訓
  - 包含檢查清單和標準作業流程
  - **絕對不能再犯同樣的錯誤！**

### 📋 設置和驗證

- **[ENV_SETUP.md](./ENV_SETUP.md)** - 環境變數檔案位置說明
- **[GIT_VERIFICATION.md](./GIT_VERIFICATION.md)** - Git 倉庫驗證報告

### 📚 其他重要文檔

- [AUDIT_LOG_GUIDE.md](./AUDIT_LOG_GUIDE.md) - 審計日誌指南
- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) - 安全審計報告
- [RENDER_ENV_SETUP.md](./RENDER_ENV_SETUP.md) - Render 環境設定

---

## 📁 專案結構

```
tucheng-cat-autopost/
├── apps/
│   ├── backend/          # NestJS 後端服務
│   └── liff-editor/      # Next.js LIFF 編輯器
├── packages/             # 共享套件
├── .env                  # 環境變數（根目錄，不提交到 Git）
└── README.md            # 本文件
```

---

## 🔧 快速開始

### 環境變數設置

**重要**: `.env` 檔案**必須**在專案根目錄！

```bash
# 位置
C:\Users\diowy\tucheng-cat-autopost\.env
```

詳細說明請參考 [ENV_SETUP.md](./ENV_SETUP.md)

### 安裝依賴

```bash
# 後端
cd apps/backend
npm install

# LIFF 編輯器
cd apps/liff-editor
npm install
```

---

## ⚠️ 重要提醒

### 部署前檢查清單

在進行任何操作前，**必須**參考 [LESSONS_LEARNED.md](./LESSONS_LEARNED.md) 中的檢查清單：

- [ ] 確認當前專案路徑
- [ ] 確認遠程倉庫 URL
- [ ] 確認 .env 檔案位置
- [ ] 驗證 Channel ID 和 LIFF ID
- [ ] 確認 API 設定正確
- [ ] 執行測試確認功能正常

### 絕對不能做的事

根據 [LESSONS_LEARNED.md](./LESSONS_LEARNED.md)：

1. ❌ **絕對不要**使用錯誤的專案資訊
2. ❌ **絕對不要**在錯誤位置創建 .env 檔案
3. ❌ **絕對不要**使用未驗證的 API 模型
4. ❌ **絕對不要**跳過檢查清單
5. ❌ **絕對不要**假設環境變數是正確的

---

## 🔍 Git 狀態

本專案是一個**獨立的 Git 倉庫**：

- **遠程倉庫**: `https://github.com/Steven-Yeh-1011/tucheng-cat-autopost.git`
- **分支狀態**: 與遠程同步

詳細驗證報告請參考 [GIT_VERIFICATION.md](./GIT_VERIFICATION.md)

---

## 📖 子專案說明

### 後端 (apps/backend)

- NestJS 應用程式
- LINE Bot API 整合
- Rich Menu 管理
- 自動發文功能

詳細說明請參考 [apps/backend/README.md](./apps/backend/README.md)

### LIFF 編輯器 (apps/liff-editor)

- Next.js 應用程式
- Rich Menu 視覺化編輯器
- 草稿管理

詳細說明請參考 [apps/liff-editor/README.md](./apps/liff-editor/README.md)

---

## 🔐 安全性

- ✅ `.env` 檔案已加入 `.gitignore`
- ✅ 敏感資訊不會被提交到 Git
- ✅ 所有 API Key 和 Token 只存在本地

詳細安全審計請參考 [SECURITY_AUDIT.md](./SECURITY_AUDIT.md)

---

## 📝 變更記錄

### 2024-12-03

- ✅ 創建 [LESSONS_LEARNED.md](./LESSONS_LEARNED.md) - 記錄所有錯誤和防範措施
- ✅ 創建 [GIT_VERIFICATION.md](./GIT_VERIFICATION.md) - Git 倉庫驗證報告
- ✅ 創建 [ENV_SETUP.md](./ENV_SETUP.md) - 環境變數位置說明
- ✅ 修正 .env 檔案位置（移至根目錄）
- ✅ 修正 Google AI API 模型名稱
- ✅ 更新所有腳本以明確指定 .env 路徑

---

## 📞 支援

如有問題，請先參考：

1. [LESSONS_LEARNED.md](./LESSONS_LEARNED.md) - 常見錯誤和解決方案
2. [GIT_VERIFICATION.md](./GIT_VERIFICATION.md) - Git 相關問題
3. [ENV_SETUP.md](./ENV_SETUP.md) - 環境變數問題

---

**記住：預防勝於治療，檢查勝於修復！**

