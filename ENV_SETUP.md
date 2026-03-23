# 環境變數檔案位置說明

## .env 檔案位置

**正確位置：專案根目錄**
```
C:\Users\diowy\tucheng-cat-autopost\.env
```

## 重要說明

1. ✅ **.env 檔案只存在專案根目錄**
   - 不在 `apps/backend/.env`
   - 不在其他子目錄
   - 只存在 `tucheng-cat-autopost\.env`

2. ✅ **.env 已被 gitignore**
   - `.gitignore` 檔案已包含 `.env`
   - 不會被提交到 GitHub
   - 只存在本地端

3. ✅ **腳本會從專案根目錄讀取**
   - `generate-rich-menu.ts` 已設定從專案根目錄讀取
   - `generate-image-only.ts` 已設定從專案根目錄讀取
   - 所有腳本都使用 `dotenv.config({ path: path.join(projectRoot, '.env') })`

## 檔案內容

```
# LINE Channel 相關環境變數
LINE_CHANNEL_ACCESS_TOKEN=您的Token
LINE_CHANNEL_ID=2008557763
LINE_CHANNEL_SECRET=您的Secret

# LIFF 相關環境變數
LIFF_ID=2008612222-PgzW5BGy
LIFF_URL=https://liff.line.me/2008612222-PgzW5BGy
```

## 安全性

- ✅ `.env` 檔案不會被提交到 GitHub
- ✅ 所有敏感資訊只存在本地端
- ✅ 請勿分享 .env 檔案內容

