# tucheng-cat-autopost 憲法 (OpenSpec Constitution)

本憲法依循 OpenSpec 建議結構撰寫，作為專案決策與協作的最高原則。

## 1. 專案宗旨

提供「土城浪貓」相關服務的 LINE LIFF 編輯器與自動貼文工具，確保志工能安全、快速、可靠地管理內容。

## 2. 開發原則

1. **規格驅動**：任何功能變更需先更新 `specify.md` 或對應 specs，再進行開發。
2. **最小變更**：每個 PR 聚焦單一目標，包含必要文件與測試。
3. **安全與隱私**：機密金鑰只存在於環境變數；禁止寫入 repo。
4. **環境變數驗證**：後端啟動時必須驗證必要環境變數（如 `DATABASE_URL`、`SUPABASE_URL`、`SUPABASE_KEY` 等），缺少關鍵變數時應明確報錯並拒絕啟動，避免資料寫入錯誤的資料庫或服務。開發工具（如 MCP）的授權狀態不影響 Runtime 執行環境的資料流向。
5. **可追蹤性**：部署配置固定由 `vercel.json` + Vercel 儀表板共同管理；重大決策需文檔化。
6. **中文回覆**：溝通與文件若無特殊需求，預設以中文回覆與撰寫，確保團隊理解一致。

## 3. 開發流程

1. 撰寫/更新 `specify`。
2. 實作與測試，更新必要文件。
3. 建立 PR，至少一位 reviewer。
4. 透過 Vercel Preview 驗證。
5. 合併至 `main` 後由 Vercel 自動部署；若需回滾，使用 `git revert`。

## 4. 團隊約定

- **作者責任**：確保程式與規格一致、附上測試/驗證步驟。
- **Reviewer**：檢查是否違反憲法、規格與安全原則。
- **文件維護**：Retro 與 lesson learned 要在 24 小時內更新文件。

## 5. 代碼與架構標準

- 前端：Next.js 16（`apps/liff-editor`）、Node.js 20.x。
- 後端：NestJS（`apps/backend`）。
- 套件管理：npm（`package-lock.json`）；禁止使用 pnpm/yarn。
- 部署：Vercel（Production / Preview）。

## 6. 版本控制策略

- 單一 `main` 主分支，保持可隨時部署。
- 禁止 force push（除非事故，且需紀錄）。
- Commit message 採 `type: summary` 格式。

## 7. 例外與事故處理

緊急狀況可臨時繞過流程，但須在 24 小時內補寫：
- 事件描述與影響
- 修復步驟
- 對 `specify` / 憲法的必要更新

---

本文件為活文檔，任何修改需提出 PR 並經核心維運者審核。請所有參與者遵守，以維持專案品質與治理。

