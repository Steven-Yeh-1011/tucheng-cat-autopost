# Meta 應用程式設定 - 實際介面操作指南

根據您看到的實際介面，本指南提供準確的操作步驟。

## 當前頁面：基本資料設定

您現在在「**應用程式設定**」→「**基本資料**」頁面。

### 已看到的資訊

- **應用程式編號 (App ID)**: `2905730826286376` ✅
- **應用程式密鑰 (App Secret)**: 已隱藏，點擊「顯示」可查看
- **顯示名稱**: `土城貓舍自動發文系統` ✅
- **聯絡電子郵件**: `s0919708515@yahoo.com.tw` ✅

---

## 步驟 1: 設定應用程式網域

### 1.1 找到「應用程式網域」欄位

在「基本資料」頁面中，找到「**應用程式網域**」（App Domains）欄位。

### 1.2 填入網域

在「應用程式網域」欄位中輸入：
```
onrender.com
```

### 1.3 儲存

點擊頁面底部的「**儲存變更**」按鈕。

---

## 步驟 2: 查看 App Secret

### 2.1 點擊「顯示」按鈕

在「**應用程式密鑰**」（App Secret）欄位旁，點擊「**顯示**」按鈕。

### 2.2 複製 App Secret

1. 系統可能會要求輸入密碼確認
2. 輸入密碼後，App Secret 會顯示
3. **立即複製並妥善保管**（稍後需要用到）

---

## 步驟 3: 新增產品（Instagram Graph API）

### 3.1 找到產品設定

在左側選單中：
1. 查看是否有「**產品**」（Products）選項
2. 或點擊「**應用程式設定**」查看是否有子選單
3. 或直接前往：在瀏覽器網址列，將 `/settings/basic/` 改為 `/products/`

### 3.2 新增 Instagram Graph API

1. 點擊「**新增產品**」或「**Add Product**」按鈕
2. 搜尋「**Instagram Graph API**」
3. 點擊「**設定**」或「**Set Up**」

---

## 步驟 4: 設定 Facebook Login

### 4.1 進入 Facebook Login 設定

在左側選單中：
1. 找到「**商家專用 Facebook 登入**」（Business-specific Facebook Login）
2. 展開後點擊相關設定選項
3. 或直接前往：將網址改為 `/settings/fb-login/`

### 4.2 設定 OAuth Redirect URI

1. 找到「**有效的 OAuth 重新導向 URI**」或「**Valid OAuth Redirect URIs**」
2. 新增：
   ```
   https://tucheng-cat-autopost.onrender.com
   ```
3. 點擊「**儲存變更**」

---

## 步驟 5: 取得必要資訊

### 5.1 已取得的資訊

- ✅ **App ID**: `2905730826286376`
- ⏳ **App Secret**: 需要點擊「顯示」取得

### 5.2 還需要取得的資訊

1. **Facebook Page ID** - 從粉絲專頁取得
2. **Instagram Account ID** - 使用 Graph API Explorer 查詢
3. **Access Token** - 使用 Graph API Explorer 產生

---

## 步驟 6: 使用 Graph API Explorer

### 6.1 前往 Graph API Explorer

1. 在頂部導航列點擊「**工具**」（Tools）
2. 選擇「**圖形 API 測試工具**」（Graph API Test Tool）
3. 或直接前往：https://developers.facebook.com/tools/explorer/

### 6.2 在 Graph API Explorer 中

1. 在右上角選擇您的應用程式：「**土城貓舍自動發文系統**」
2. 開始查詢需要的資訊

---

## 步驟 7: 取得 Page ID

### 7.1 方法一：從粉絲專頁

1. 前往您的 Facebook 粉絲專頁
2. 點擊「關於」
3. 找到「粉絲專頁編號」或「Page ID」

### 7.2 方法二：使用 Graph API Explorer

1. 在 Graph API Explorer 中
2. 查詢欄位輸入：`me/accounts`
3. 點擊「提交」
4. 在結果中找到您的粉絲專頁，複製 `id`

---

## 步驟 8: 取得 Instagram Account ID

### 8.1 確認 Instagram 已連結

確保 Instagram 商業帳號已連結到 Facebook 粉絲專頁。

### 8.2 使用 Graph API Explorer 查詢

1. 在 Graph API Explorer 中
2. 查詢欄位輸入（將 `{page-id}` 替換為您的 Page ID）：
   ```
   {page-id}?fields=instagram_business_account
   ```
3. 點擊「提交」
4. 複製 `instagram_business_account.id`

---

## 步驟 9: 取得 Access Token

### 9.1 在 Graph API Explorer 中

1. 選擇您的應用程式
2. 在「使用者或粉絲專頁」下拉選單中，選擇您的粉絲專頁
3. 點擊「產生存取權杖」
4. 選擇權限：
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
5. 點擊「產生存取權杖」
6. 複製 Token

### 9.2 轉換為長期 Token（可選）

如果需要長期 Token，使用 API 轉換（見完整指南）。

---

## 步驟 10: 在 Render 設定環境變數

### 10.1 前往 Render Dashboard

1. 前往：https://dashboard.render.com
2. 選擇您的 Web Service：`tucheng-cat-autopost`

### 10.2 設定環境變數

在「Environment」區塊新增：

```
META_ACCESS_TOKEN=您的AccessToken
META_PAGE_ID=您的PageID
META_IG_ACCOUNT_ID=您的IGAccountID
```

---

## 當前需要完成的動作

根據您看到的介面，現在請：

1. ✅ **設定應用程式網域**：
   - 在「應用程式網域」欄位輸入：`onrender.com`
   - 點擊「儲存變更」

2. ✅ **取得 App Secret**：
   - 點擊「顯示」按鈕
   - 複製 App Secret

3. ⏳ **新增 Instagram Graph API 產品**：
   - 找到產品設定頁面
   - 新增 Instagram Graph API

4. ⏳ **設定 Facebook Login**：
   - 設定 OAuth Redirect URI

告訴我您現在在哪一步，或遇到什麼問題，我可以提供更具體的協助！

