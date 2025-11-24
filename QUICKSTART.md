# 快速啟動指南

## 第一次設定

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 啟動資料庫

使用 Docker Compose：

```bash
docker-compose up -d
```

或使用現有 PostgreSQL，確保資料庫已建立。

### 3. 設定環境變數

在 `apps/backend` 目錄建立 `.env` 檔案：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tucheng_cat_autopost?schema=public"
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
```

在 `apps/liff-editor` 目錄建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_LIFF_ID=your-liff-id
```

### 4. 執行資料庫 Migration

```bash
cd apps/backend
pnpm prisma:migrate dev --name init
```

### 5. 啟動開發伺服器

在專案根目錄：

```bash
pnpm dev
```

或分別啟動：

```bash
# Terminal 1: Backend
pnpm dev:backend

# Terminal 2: Frontend
pnpm dev:frontend
```

## 測試 API

### 生成測試草稿

```bash
curl -X POST http://localhost:3001/api/tasks/generate-daily-draft
```

### 取得草稿

```bash
curl http://localhost:3001/api/posts/{post-id}
```

## 訪問 LIFF 編輯器

1. 確保 Frontend 運行在 `http://localhost:3000`
2. 訪問 `http://localhost:3000/editor/{post-id}`
3. 如需在 LINE 中測試，使用 ngrok：

```bash
ngrok http 3000
```

將 ngrok URL 設定到 LINE Developers Console。

## 常見問題

### Prisma Client 未生成

```bash
cd apps/backend
pnpm prisma:generate
```

### 端口被占用

修改 `.env` 中的 `BACKEND_PORT` 或 `NEXT_PUBLIC_BACKEND_URL`

### 資料庫連接失敗

檢查：
1. PostgreSQL 是否運行
2. `DATABASE_URL` 是否正確
3. 資料庫是否已建立

