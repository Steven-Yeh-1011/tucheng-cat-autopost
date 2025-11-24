# Meta 應用程式完整設定指南

本指南將帶您完成「土城貓舍自動發文系統」的所有 Meta 設定步驟。

## 當前狀態

您已經：
- ✅ 建立應用程式「土城貓舍自動發文系統」
- ✅ 進入主控板（Dashboard）
- ⚠️ 需要完成使用案例和產品設定

---

## 步驟 1: 完成使用案例設定

### 1.1 查看當前使用案例

在主控板中，您會看到：
- 「自訂管理粉絲專頁所有內容的使用案例」
- 「自訂『管理 Instagram 的訊息和內容』的使用案例」
- 「測試使用案例」

### 1.2 點擊「新增使用案例」

1. 點擊右上角的「**新增使用案例**」按鈕（鉛筆圖示）
2. 或點擊主控板中的使用案例項目進入設定

### 1.3 完成使用案例設定

對於每個使用案例：
1. 點擊使用案例項目（右側有箭頭 >）
2. 按照系統引導完成設定
3. 填寫必要的說明和用途

---

## 步驟 2: 新增必要的產品（Products）

### 2.1 進入產品設定

1. 在左側選單找到「**應用程式設定**」（App Settings）
2. 展開後點擊「**基本**」（Basic）或「**Basic**」
3. 或直接前往：在 Dashboard 中找到「Products」區塊

### 2.2 新增 Instagram Graph API

1. 在產品列表中，找到「**Instagram Graph API**」
2. 如果沒有，點擊「**新增產品**」或「**Add Product**」
3. 搜尋並新增「**Instagram Graph API**」
4. 點擊「**設定**」或「**Set Up**」

### 2.3 新增 Facebook Login（如果還沒有）

1. 確認「**Facebook Login**」已新增
2. 如果沒有，新增並設定：
   - 選擇「Web」平台
   - 設定 Redirect URI（見步驟 3）

### 2.4 確認已新增的產品

應該要有：
- ✅ Facebook Login
- ✅ Instagram Graph API
- ✅ Pages API（通常會自動新增）

---

## 步驟 3: 設定 OAuth Redirect URI

### 3.1 進入 Facebook Login 設定

1. 在左側選單找到「**商家專用 Facebook 登入**」（Business-specific Facebook Login）
2. 或前往「**應用程式設定**」→「**Facebook Login**」→「**設定**」

### 3.2 設定有效的 OAuth Redirect URI

1. 找到「**有效的 OAuth 重新導向 URI**」或「**Valid OAuth Redirect URIs**」
2. 新增以下 URI：
   ```
   https://tucheng-cat-autopost.onrender.com
   ```
3. 如果您的 Render URL 不同，請使用實際的 URL
4. 點擊「**儲存變更**」或「**Save Changes**」

### 3.3 設定應用程式網域

1. 前往「**應用程式設定**」→「**基本**」
2. 找到「**應用程式網域**」或「**App Domains**」
3. 新增：
   ```
   onrender.com
   ```
4. 點擊「**儲存變更**」

---

## 步驟 4: 取得 App ID 和 App Secret

### 4.1 查看 App ID

1. 前往「**應用程式設定**」→「**基本**」
2. 找到「**應用程式編號**」或「**App ID**」
3. 複製此 ID（稍後可能需要）

### 4.2 查看 App Secret

1. 在同一頁面找到「**應用程式密鑰**」或「**App Secret**」
2. 點擊「**顯示**」或「**Show**」
3. 輸入密碼確認
4. 複製 App Secret（**請妥善保管，不要洩露**）

---

## 步驟 5: 取得 Facebook Page ID

### 5.1 方法一：從粉絲專頁設定

1. 前往您的 Facebook 粉絲專頁
2. 點擊左側選單的「**關於**」（About）
3. 向下滾動找到「**粉絲專頁編號**」或「**Page ID**」
4. 複製此 ID

### 5.2 方法二：使用 Graph API Explorer

1. 前往：https://developers.facebook.com/tools/explorer/
2. 在右上角選擇您的應用程式
3. 在查詢欄位輸入：
   ```
   me/accounts
   ```
4. 點擊「**提交**」或「**Submit**」
5. 在結果中找到您的粉絲專頁，複製 `id` 欄位

---

## 步驟 6: 取得 Instagram Account ID

### 6.1 確認 Instagram 帳號已連結

1. 確保您的 Instagram 帳號是**商業帳號**（Business Account）
2. 將 Instagram 帳號連結到 Facebook 粉絲專頁：
   - Instagram 設定 → Account → Linked Accounts → Facebook
   - 選擇您的粉絲專頁並連結

### 6.2 使用 Graph API Explorer 查詢

1. 前往：https://developers.facebook.com/tools/explorer/
2. 選擇您的應用程式
3. 在查詢欄位輸入（將 `{page-id}` 替換為您的 Page ID）：
   ```
   {page-id}?fields=instagram_business_account
   ```
4. 點擊「**提交**」
5. 在結果中找到 `instagram_business_account.id`，這就是您的 Instagram Account ID

---

## 步驟 7: 取得 Access Token

### 7.1 使用 Graph API Explorer 取得短期 Token

1. 前往：https://developers.facebook.com/tools/explorer/
2. 在右上角選擇您的應用程式
3. 在「**使用者或粉絲專頁**」下拉選單中，選擇您的粉絲專頁
4. 點擊「**產生存取權杖**」或「**Generate Access Token**」
5. 選擇需要的權限：
   - ✅ `pages_manage_posts` - 發佈貼文到粉絲專頁
   - ✅ `pages_read_engagement` - 讀取互動數據
   - ✅ `instagram_basic` - Instagram 基本權限
   - ✅ `instagram_content_publish` - 發佈內容到 Instagram
6. 點擊「**產生存取權杖**」
7. 複製生成的 Token（這是短期 Token，約 1-2 小時有效）

### 7.2 轉換為長期 Token（推薦）

使用以下 API 將短期 Token 轉換為長期 Token：

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

替換：
- `{app-id}`: 您的 App ID（步驟 4.1 取得）
- `{app-secret}`: 您的 App Secret（步驟 4.2 取得）
- `{short-lived-token}`: 步驟 7.1 取得的短期 Token

回應中的 `access_token` 就是長期 Token（約 60 天有效）。

### 7.3 取得 Page Access Token（最推薦，不會過期）

1. 在 Graph API Explorer 中
2. 選擇您的粉絲專頁
3. 在查詢欄位輸入（將 `{page-id}` 替換為您的 Page ID）：
   ```
   {page-id}?fields=access_token
   ```
4. 點擊「**提交**」
5. 複製 `access_token`（這是 Page Access Token，不會過期，但建議定期更新）

---

## 步驟 8: 申請必要的權限

### 8.1 進入權限申請頁面

1. 在左側選單找到「**必要動作**」（Required Actions）
2. 或前往「**應用程式審查**」→「**權限和功能**」或「**App Review**」→「**Permissions and Features**」

### 8.2 申請權限

申請以下權限：

#### pages_manage_posts
- **用途**: 發佈貼文到粉絲專頁
- **申請方式**: 搜尋 `pages_manage_posts`，點擊「**申請**」或「**Request**」
- **使用案例說明**: 「用於自動發佈內容到 Facebook 粉絲專頁」

#### pages_read_engagement
- **用途**: 讀取互動數據
- **申請方式**: 搜尋並申請
- **使用案例說明**: 「用於讀取貼文的互動數據」

#### instagram_basic
- **用途**: Instagram 基本功能
- **申請方式**: 搜尋並申請
- **使用案例說明**: 「用於管理 Instagram 帳號基本資訊」

#### instagram_content_publish
- **用途**: 發佈內容到 Instagram
- **申請方式**: 搜尋並申請
- **使用案例說明**: 「用於自動發佈內容到 Instagram」

### 8.3 填寫申請資料

對於每個權限：
1. 填寫使用案例說明
2. 上傳截圖或說明文件（如果需要）
3. 提交申請

**注意**: 測試環境可以先跳過審核，使用開發者帳號測試。

---

## 步驟 9: 在 Render 設定環境變數

### 9.1 進入 Render Web Service 設定

1. 前往 Render Dashboard
2. 選擇您的 Web Service：`tucheng-cat-autopost`
3. 點擊「**Environment**」或「**環境變數**」

### 9.2 設定環境變數

新增以下環境變數：

| 環境變數 | 值 | 說明 |
|---------|-----|------|
| `META_ACCESS_TOKEN` | `您的AccessToken` | 步驟 7 取得的 Access Token |
| `META_PAGE_ID` | `您的PageID` | 步驟 5 取得的 Page ID |
| `META_IG_ACCOUNT_ID` | `您的IGAccountID` | 步驟 6 取得的 Instagram Account ID |

### 9.3 儲存並重新部署

1. 點擊「**Save Changes**」或「**儲存變更**」
2. Render 會自動重新部署服務

---

## 步驟 10: 測試發佈功能

### 10.1 測試 Facebook 發佈

使用 Graph API Explorer 測試：

1. 前往：https://developers.facebook.com/tools/explorer/
2. 選擇您的應用程式和粉絲專頁
3. 方法選擇「**POST**」
4. 查詢欄位輸入（將 `{page-id}` 替換為您的 Page ID）：
   ```
   {page-id}/feed
   ```
5. 在「**參數**」中新增：
   - `message`: `測試貼文`
   - `access_token`: 您的 Access Token
6. 點擊「**提交**」
7. 檢查是否成功發佈

### 10.2 測試 Instagram 發佈

1. 在 Graph API Explorer 中
2. 方法選擇「**POST**」
3. 查詢欄位輸入（將 `{ig-account-id}` 替換為您的 Instagram Account ID）：
   ```
   {ig-account-id}/media
   ```
4. 在「**參數**」中新增：
   - `image_url`: 圖片 URL（必須是公開可訪問的 HTTPS URL）
   - `caption`: `測試貼文`
   - `access_token`: 您的 Access Token
5. 點擊「**提交**」
6. 取得 `id`，然後使用此 ID 發佈：
   ```
   {ig-account-id}/media_publish
   ```
   參數：
   - `creation_id`: 上一步取得的 `id`
   - `access_token`: 您的 Access Token

---

## 步驟 11: 驗證所有設定

### 11.1 檢查清單

確認以下項目都已完成：

- ✅ 使用案例已設定
- ✅ Instagram Graph API 已新增
- ✅ Facebook Login 已設定
- ✅ OAuth Redirect URI 已設定
- ✅ App ID 和 App Secret 已取得
- ✅ Page ID 已取得
- ✅ Instagram Account ID 已取得
- ✅ Access Token 已取得
- ✅ 必要權限已申請
- ✅ Render 環境變數已設定
- ✅ 測試發佈成功

### 11.2 檢查應用程式狀態

在主控板中確認：
- 「**發佈**」狀態（目前顯示「尚未發佈」是正常的，測試環境不需要發佈）
- 「**必要動作**」中沒有未完成的項目

---

## 常見問題

### Q: 權限申請需要多久？

A: 
- **測試環境**: 可以立即使用（開發者帳號）
- **生產環境**: 需要提交審核，通常 1-7 個工作天

### Q: Access Token 過期怎麼辦？

A: 
- 短期 Token：約 1-2 小時過期
- 長期 Token：約 60 天過期
- **建議**: 使用 Page Access Token（不會過期）

### Q: 如何更新 Access Token？

A: 
- 在 Graph API Explorer 重新產生
- 或使用 API 自動刷新（需要實作刷新機制）

### Q: Instagram 發佈失敗？

A: 檢查：
1. Instagram 帳號是否為商業帳號
2. 是否已連結到 Facebook 粉絲專頁
3. 是否已申請 `instagram_content_publish` 權限
4. 圖片 URL 是否為公開的 HTTPS URL
5. 圖片格式是否符合要求（JPG/PNG，建議 1080x1080）

---

## 完成後

設定完成後，您的系統就可以：
- ✅ 自動發佈貼文到 Facebook
- ✅ 自動發佈內容到 Instagram
- ✅ 透過 API 管理粉絲專頁內容

下一步：測試您的自動發文系統，確認所有功能正常運作！

---

## 快速參考

### 重要 URL
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- 應用程式設定: https://developers.facebook.com/apps/{app-id}/settings/basic/
- 權限申請: https://developers.facebook.com/apps/{app-id}/app-review/permissions/

### 重要 ID 位置
- App ID: 應用程式設定 → 基本
- Page ID: 粉絲專頁 → 關於
- Instagram Account ID: Graph API Explorer 查詢 `{page-id}?fields=instagram_business_account`

