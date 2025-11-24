# Specify：切換 npm 部署與文件建立

本規格遵循 OpenSpec 的需求/場景格式，描述本次變更需要達成的行為。

## 0. 架構 / 部署對應

| 模組 / 來源資料夾 | 功能 | Deploy Service | 平台 | 追蹤分支 |
| --- | --- | --- | --- | --- |
| `apps/liff-editor` | Next.js 16 LIFF 編輯器（前台） | `tucheng-cat-autopost-liff-editor` | Vercel | `main` |
| `apps/backend` | NestJS API / Webhook 服務（提供資料存取、自動貼文） | `tucheng-cat-autopost-backend`（命名依 Render 控制台為準） | Render Web Service | `main` |

- Render 僅部署後端；前端維持在 Vercel。  
- 所有服務皆以 `main` 分支建置；若未來需要 staging，請在表格中新增分支對應。  
- 任何服務若增加（例如 cron、message relay），都需在本表補上 Deploy target 與功能說明。

## Requirement: npm 為唯一套件管理工具

系統需要移除 pnpm 依賴，確保 Vercel 及本地建置皆使用 npm。

### Scenario: Vercel 使用 npm ci
- **GIVEN** `vercel.json`（根目錄與 `apps/liff-editor/`）已指定 `npm run build` 與 `npm ci`
- **WHEN** 觸發 Vercel 部署
- **THEN** Build Log 中的 install 步驟應顯示 `npm ci`
- **AND** 不再出現 `pnpm` 相關錯誤

### Scenario: 本地環境以 npm 執行
- **GIVEN** 專案根目錄存在 `.npmrc`、`apps/liff-editor/` 下存在 `.npmrc` 與 `package-lock.json`
- **WHEN** 在 `apps/liff-editor` 執行 `npm ci && npm run build`
- **THEN** 指令應成功完成
- **AND** `npm list --depth=0` 無缺少依賴或 pnpm 相關訊息

## Requirement: 建立 OpenSpec 規範文件

需要依 OpenSpec 規則產出專案憲法與 specify 文件。

### Scenario: 憲法文件存在
- **GIVEN** 專案根目錄存在 `CONSTITUTION.md`
- **WHEN** 檢視內容
- **THEN** 包含宗旨、開發原則、流程、團隊約定、代碼/版本策略與例外處理

### Scenario: specify 文件可供擴充
- **GIVEN** 專案根目錄有 `specify.md`
- **WHEN** 未來新增需求
- **THEN** 可在此文件延伸 Requirement/Scenario，作為開發與審查依據

## Requirement: Render 環境需帶入 Vercel 變數

Render 服務若要模擬 Vercel 行為（例如部分函式依賴 `process.env.VERCEL_*`），必須在對應的 Render Service 上設定下列環境變數。

### Scenario: `tucheng-cat-autopost-backend` 服務帶有 Vercel 變數
- **GIVEN** Render 控制台中，`tucheng-cat-autopost-backend`（NestJS API）已進入「Environment → Environment Variables」
- **WHEN** 建立以下鍵值  
  | Key | 說明 | 建議值 |
  | --- | --- | --- |
  | `VERCEL` | 是否為 Vercel 環境 | `1` |
  | `VERCEL_ENV` | `production` / `preview` / `development`，Render Production 服務請設 `production` | 依服務性質 |
  | `VERCEL_REGION` | 近似 Vercel 區域；可使用 `iad1`（US-East）或接近 Render Region 的值 | 依部署地 |
  | `VERCEL_URL` | 服務對外網址（不含 `https://`） | 例如 `tucheng-cat-autopost-backend.onrender.com` |
  | `VERCEL_GIT_COMMIT_SHA` | Render build 時的 commit SHA | 使用 Render 內建環境變數 `SOURCE_VERSION` 或手動填寫 |
  | `VERCEL_GIT_COMMIT_REF` | 分支名稱 | `main` |
  | `VERCEL_GIT_COMMIT_MESSAGE` | 最新 commit 訊息 | 可由 CI 腳本注入或手動維護 |
  | `VERCEL_GIT_PROVIDER` | 原始 Git 供應商 | `github` |
  | `VERCEL_PROJECT_PRODUCTION_URL` | 正式前端網域（供 API 產生絕對網址） | `tucheng-cat-autopost-liff-editor.vercel.app` |
- **THEN** NestJS 服務若呼叫任何依賴 `VERCEL_*` 變數的邏輯，可在 Render 上取得正確值
- **AND** 文件需註明，若其他 Render 服務（例如未來的 worker）也需要這些變數，須複製相同設定

---

驗證本規格後，請將後續規劃亦透過 OpenSpec（`specify.md` 或 `openspec/specs/**/*`）持續追蹤，以維持與憲法一致的規格驅動開發流程。
# Specify：Liff Editor 2025-11-24

本文件依 OpenSpec 精神，描述本次變更（移除 pnpm 依賴、改用 npm 並更新部署流程）的具體需求、輸出與驗證方式。

## 1. 背景

- `apps/liff-editor` 使用 Next.js 16。原先 Vercel 部署預設使用 pnpm，導致 `ERR_PNPM_UNSUPPORTED_ENGINE`。
- 專案決策：改以 npm + `package-lock.json` 作為唯一的安裝方式，並使用 `.npmrc`、`vercel.json` 控制部署。
- 需建立團隊憲法與規格文件，支援後續透過 OpenSpec 的協作。

## 2. 需求

1. **安裝工具**
   - 全域安裝 OpenSpec CLI（`@fission-ai/openspec`）。  
   - `openspec --version` 可成功輸出版本。

2. **部署設定**
   - `apps/liff-editor/vercel.json` 與 repo 根目錄 `vercel.json` 皆明確指定 `npm run build` / `npm ci`。
   - 移除 `nodeVersion` 欄位，避免 schema 驗證失敗。
   - `apps/liff-editor/.npmrc` 內至少包含 `package-lock=true`，根目錄 `.npmrc` 可設定 `engine-strict=false`。
   - 已產生 `apps/liff-editor/package-lock.json` 並確保安裝成功 (`npm list --depth=0` 無錯誤)。

3. **文件輸出**
   - `CONSTITUTION.md`：專案級憲法（使命、原則、流程、例外）。  
   - `specify.md`（即本文件）：記錄此次變更規格。  

4. **版本控制**
   - 所有相關檔案已 commit 並 push 至 `main`。
   - 若需要重新部署，可利用空 commit 觸發。

## 3. 成功標準

- Vercel 部署設定與 log 中顯示 `npm ci` 而非 `pnpm install`。  
- Schema 驗證不再因 `nodeVersion` 欄位失敗。  
- OpenSpec CLI 已安裝且版本輸出正常。  
- 專案根目錄存在 `CONSTITUTION.md` 與 `specify.md`，內容完整、語意清楚。

## 4. 驗證步驟

1. **本地檢查**
   ```bash
   cd apps/liff-editor
   npm ci
   npm run build
   ```
   應成功完成而無 pnpm 相關錯誤。

2. **Vercel 部署**
   - 查看最新部署 log，確認 `Running "install" command: npm ci`。  
   - 若需要，自 Vercel 儀表板 Redeploy（或 push 空 commit）。

3. **文件確認**
   - `CONSTITUTION.md` 存在且描述專案使命/原則。  
   - `specify.md` 概述此次需求與驗證。

## 5. 待辦 / 風險

- Vercel 儀表板若仍有舊設定（例如仍記錄 pnpm）需再次確認 override 狀態。  
- 未來若要支援多框架，需更新 `CONSTITUTION.md` 中的流程段落。

## 6. Lesson Learned（固定區塊）

- **LL-2025-11-24-01**：Vercel 儀表板即使清空欄位，若未關閉 override 或未直接填入指令，仍會 fallback 至 pnpm。作法：在儀表板明確輸入 `npm ci` / `npm run build`，並於 `vercel.json` 中同步記錄。
- 未來任何事件請在此區塊追加 `LL-YYYY-MM-DD-XX` 條目，保持時間序與描述（緣由、處理、預防措施）。

---

此 `specify.md` 將作為後續 OpenSpec 工作流程的起點，未來新功能請新增或延伸本文件，並維持與 `CONSTITUTION.md` 所述原則一致。

