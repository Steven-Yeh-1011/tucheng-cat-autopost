# Meta Developer 設定指南

本指南將協助您設定 Meta (Facebook/Instagram) API，以便自動發佈貼文到 Facebook 和 Instagram。

## 前置需求

1. Facebook 帳號
2. Facebook 粉絲專頁（Page）
3. Instagram 商業帳號（Business Account，可選）
4. Meta Developer 帳號

---

## 步驟 1: 建立 Meta App

### 1.1 登入 Meta for Developers

1. 前往：https://developers.facebook.com/
2. 使用您的 Facebook 帳號登入
3. 如果還沒有開發者帳號，點擊「Get Started」完成註冊

### 1.2 建立新 App（新版系統）

Meta 已推出新的應用程式建立系統，提供更簡化的流程：

#### 方法一：使用新版系統（推薦）

1. 點擊右上角「My Apps」→「Create App」
2. 如果看到「你可以透過新方式使用 Meta 建立應用程式」的彈窗：
   - 閱讀說明（新系統提供可自訂的使用案例、新主控板，以及更簡化的權限設定）
   - 點擊「建立應用程式」繼續
3. 填寫應用程式詳細資料：
   - **應用程式名稱**: `土城貓舍自動發文系統`（或您喜歡的名稱）
   - **應用程式聯絡電子郵件地址**: 您的 Email（例如：`s0919708515@yahoo.com`）
   - 點擊「繼續」
4. 選擇使用案例：
   - 新系統會引導您選擇適合的使用案例
   - 選擇「Business」或「Social Media Management」相關選項
   - 或選擇「Other」然後自訂
5. 完成建立：
   - 系統會自動設定必要的權限和產品
   - 您將進入新的主控板

#### 方法二：使用傳統方式

如果沒有看到新系統選項，使用傳統方式：

1. 點擊右上角「My Apps」→「Create App」
2. 選擇應用類型：
   - 選擇「Business」或「Other」
   - 點擊「Next」
3. 填寫 App 資訊：
   - **App Name**: `土城貓舍自動發文系統`
   - **App Contact Email**: 您的 Email
   - **Business Account**: 選擇或建立（可選）
   - 點擊「Create App」

---

## 步驟 2: 新增產品（Products）

### 2.1 新版系統 vs 傳統系統

#### 新版系統（如果使用新系統建立）

新系統會根據您選擇的使用案例自動建議和設定產品，但您仍可能需要手動新增：

1. 在新主控板中，找到「Products」或「產品」區塊
2. 系統可能已自動新增相關產品
3. 如果需要手動新增，點擊「Add Product」或「新增產品」

#### 傳統系統（如果使用傳統方式建立）

### 2.2 新增 Facebook Login（用於取得 Token）

1. 在 App Dashboard 中，找到「Add Products to Your App」或「新增產品」
2. 找到「Facebook Login」，點擊「Set Up」或「設定」
3. 選擇「Web」平台
4. 設定：
   - **Site URL**: `https://tucheng-cat-autopost.onrender.com`（您的 Render Web Service URL）
   - 點擊「Save」或「儲存」

### 2.3 新增 Instagram Graph API（推薦，用於發佈到 Instagram）

1. 在「Add Products」或「新增產品」中找到「Instagram Graph API」
2. 點擊「Set Up」或「設定」
3. 按照指示完成設定
4. 確保已連結 Instagram 商業帳號到 Facebook 粉絲專頁

---

## 步驟 3: 取得 Facebook Page ID

### 3.1 方法一：從粉絲專頁設定

1. 前往您的 Facebook 粉絲專頁
2. 點擊左側選單的「About」（關於）
3. 向下滾動找到「Page ID」
4. 複製這個 ID

### 3.2 方法二：使用 Graph API Explorer

1. 前往：https://developers.facebook.com/tools/explorer/
2. 選擇您的 App
3. 在查詢欄位輸入：`me/accounts`
4. 點擊「Submit」
5. 在結果中找到您的粉絲專頁，複製 `id` 欄位

### 3.3 方法三：從粉絲專頁 URL

如果您的粉絲專頁 URL 是：
```
https://www.facebook.com/your-page-name
```

可以透過 Graph API 查詢：
```
https://graph.facebook.com/your-page-name?access_token=YOUR_TOKEN
```

---

## 步驟 4: 取得 Instagram Account ID

### 4.1 連結 Instagram 帳號到 Facebook 粉絲專頁

1. 確保您的 Instagram 帳號是**商業帳號**（Business Account）
2. 前往 Instagram 設定 → Account → Switch to Professional Account
3. 將 Instagram 帳號連結到 Facebook 粉絲專頁：
   - Instagram 設定 → Account → Linked Accounts → Facebook
   - 選擇您的粉絲專頁並連結

### 4.2 取得 Instagram Account ID

1. 前往 Graph API Explorer：https://developers.facebook.com/tools/explorer/
2. 選擇您的 App
3. 在查詢欄位輸入：
   ```
   {page-id}?fields=instagram_business_account
   ```
   將 `{page-id}` 替換為您的 Facebook Page ID
4. 點擊「Submit」
5. 在結果中找到 `instagram_business_account.id`，這就是您的 Instagram Account ID

---

## 步驟 5: 取得 Access Token

### 5.1 短期 Access Token（測試用）

1. 前往 Graph API Explorer：https://developers.facebook.com/tools/explorer/
2. 選擇您的 App
3. 在「User or Page」下拉選單選擇您的粉絲專頁
4. 點擊「Generate Access Token」
5. 選擇需要的權限：
   - `pages_manage_posts` - 發佈貼文到粉絲專頁
   - `pages_read_engagement` - 讀取互動數據
   - `instagram_basic` - Instagram 基本權限
   - `instagram_content_publish` - 發佈內容到 Instagram
6. 點擊「Generate Access Token」
7. 複製生成的 Token（這是短期 Token，約 1-2 小時有效）

### 5.2 長期 Access Token（生產環境用）

#### 方法一：使用 Graph API

1. 取得短期 Token 後，使用以下 API 轉換為長期 Token：

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

替換：
- `{app-id}`: 您的 App ID（在 App Dashboard → Settings → Basic）
- `{app-secret}`: 您的 App Secret（在 App Dashboard → Settings → Basic，點擊「Show」）
- `{short-lived-token}`: 步驟 5.1 取得的短期 Token

2. 回應中的 `access_token` 就是長期 Token（約 60 天有效）

#### 方法二：使用 Page Access Token（推薦）

1. 前往 Graph API Explorer
2. 選擇您的粉絲專頁
3. 在查詢欄位輸入：
   ```
   {page-id}?fields=access_token
   ```
4. 點擊「Submit」
5. 複製 `access_token`（這是 Page Access Token，不會過期，但需要定期更新）

---

## 步驟 6: 設定 App 權限和審核

### 6.1 設定權限

1. 前往 App Dashboard → App Review → Permissions and Features
2. 申請以下權限：
   - `pages_manage_posts` - 發佈貼文
   - `pages_read_engagement` - 讀取互動
   - `instagram_basic` - Instagram 基本功能
   - `instagram_content_publish` - 發佈到 Instagram

### 6.2 提交審核（生產環境需要）

- 測試環境：可以使用開發者帳號測試，無需審核
- 生產環境：需要提交審核，Meta 會審查您的使用案例

---

## 步驟 7: 在 Render 設定環境變數

在 Render Web Service 的環境變數中設定：

| 環境變數 | 值 | 說明 |
|---------|-----|------|
| `META_ACCESS_TOKEN` | `您的長期AccessToken` | Facebook/Instagram Access Token |
| `META_PAGE_ID` | `您的粉絲專頁ID` | Facebook Page ID |
| `META_IG_ACCOUNT_ID` | `您的Instagram帳號ID` | Instagram Business Account ID |

---

## 步驟 8: 測試發佈

### 8.1 測試 Facebook 發佈

使用 Graph API Explorer 測試：

```
POST https://graph.facebook.com/v18.0/{page-id}/feed
```

參數：
- `message`: 貼文內容
- `access_token`: 您的 Access Token

### 8.2 測試 Instagram 發佈

```
POST https://graph.facebook.com/v18.0/{ig-account-id}/media
```

參數：
- `image_url`: 圖片 URL
- `caption`: 貼文說明
- `access_token`: 您的 Access Token

---

## 常見問題

### Q: Access Token 過期怎麼辦？

A: 
- 短期 Token：約 1-2 小時過期
- 長期 Token：約 60 天過期
- Page Access Token：不會過期，但建議定期更新
- 建議使用 Page Access Token 或實作自動刷新機制

### Q: 如何取得 App Secret？

A:
1. 前往 App Dashboard → Settings → Basic
2. 找到「App Secret」
3. 點擊「Show」並輸入密碼
4. 複製 App Secret（請妥善保管，不要洩露）

### Q: Instagram 發佈失敗？

A: 檢查：
1. Instagram 帳號是否為商業帳號
2. 是否已連結到 Facebook 粉絲專頁
3. 是否已申請 `instagram_content_publish` 權限
4. 圖片格式是否符合要求（JPG/PNG，建議 1080x1080）

### Q: 測試環境 vs 生產環境？

A:
- **測試環境**：可以使用開發者帳號測試，無需審核
- **生產環境**：需要提交 App Review，Meta 審核通過後才能公開使用

---

## 參考資源

- [Meta for Developers 官方文件](https://developers.facebook.com/docs/)
- [Graph API 文件](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API 文件](https://developers.facebook.com/docs/instagram-api)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

---

## 安全提醒

1. **不要**將 App Secret 和 Access Token 提交到 Git
2. **使用**環境變數儲存敏感資訊
3. **定期**更新 Access Token
4. **監控**API 使用量，避免超出限制

---

## 下一步

設定完成後，您可以：
1. 在 Render 環境變數中設定 Meta 相關變數
2. 測試發佈功能
3. 整合到自動發文系統中

如有問題，請參考 Meta 官方文件或聯繫支援。

