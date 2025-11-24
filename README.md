# 土城貓舍自動發文系統 (Tucheng Cat Autopost)

一個自動化的社群媒體發文系統，支援每日自動生成草稿、LINE LIFF 編輯器審核，以及一鍵發佈到 Facebook/Instagram。

## 📋 專案概述

本專案採用 **Monorepo** 架構，包含：

- **Backend** (NestJS): RESTful API 服務，處理文章管理、圖片處理、自動化任務
- **LIFF Editor** (Next.js): LINE LIFF 編輯器，用於手機端審核與編輯草稿

## 🛠️ 技術棧

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Image Processing**: Sharp (SVG → PNG 轉換)
- **Integrations**: 
  - LINE Messaging API
  - OpenAI API
  - Meta Graph API (Facebook/Instagram)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS
- **LINE SDK**: @line/liff

### Monorepo
- **Package Manager**: pnpm workspaces

## 🚀 快速開始

### 前置需求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- (可選) Docker & Docker Compose

### 1. 安裝依賴

```bash
# 在專案根目錄執行
pnpm install
```

### 2. 環境變數設定

複製環境變數範例檔並填入實際值：

```bash
# 根目錄
cp .env.example .env

# Backend
cp apps/backend/.env.example apps/backend/.env  # (如果有的話)
```

主要環境變數：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tucheng_cat_autopost?schema=public"

# Backend
BACKEND_PORT=3001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_LIFF_ID=your-liff-id

# LINE
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_USER_ID=your-line-user-id

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Meta (Facebook/Instagram)
META_ACCESS_TOKEN=your-meta-access-token
META_PAGE_ID=your-meta-page-id
META_IG_ACCOUNT_ID=your-ig-account-id
```

### 3. 資料庫設定

#### 使用 Docker Compose (推薦)

```bash
# 在專案根目錄建立 docker-compose.yml
docker-compose up -d
```

#### 或使用現有 PostgreSQL

確保 PostgreSQL 已啟動，並建立資料庫：

```sql
CREATE DATABASE tucheng_cat_autopost;
```

### 4. 執行資料庫 Migration

```bash
# 在專案根目錄執行
pnpm prisma:migrate

# 或進入 backend 目錄
cd apps/backend
pnpm prisma:migrate dev
```

### 5. 啟動開發伺服器

```bash
# 同時啟動 Backend 和 Frontend
pnpm dev

# 或分別啟動
pnpm dev:backend  # Backend: http://localhost:3001
pnpm dev:frontend # Frontend: http://localhost:3000
```

## 📁 專案結構

```
tucheng-cat-autopost/
├── apps/
│   ├── backend/          # NestJS 後端
│   │   ├── prisma/       # Prisma schema
│   │   └── src/
│   │       ├── posts/    # 文章管理
│   │       ├── images/   # 圖片管理
│   │       ├── tasks/    # 自動化任務
│   │       ├── line/     # LINE 整合
│   │       ├── openai/   # OpenAI 整合
│   │       └── meta/     # Meta API 整合
│   └── liff-editor/      # Next.js LIFF 編輯器
│       ├── app/
│       │   └── editor/   # 編輯器頁面
│       └── components/   # React 組件
├── packages/             # 共享套件 (可選)
├── package.json          # Monorepo 根配置
└── README.md
```

## 🔌 API 端點

### 文章管理

- `GET /api/posts/:id` - 取得草稿與圖片
- `PUT /api/posts/:id` - 更新標題、內文、圖片裁切資訊
- `POST /api/posts/:id/publish` - 發佈文章到 Facebook/Instagram

### 圖片管理

- `GET /api/images/available` - 列出可用 SVG 圖片

### 自動化任務

- `POST /api/tasks/generate-daily-draft` - 生成每日草稿 (Mock)

### LINE Webhook

- `POST /line/webhook` - 接收 LINE 事件

## 📱 LIFF 編輯器使用

1. 透過 LINE Bot 收到草稿通知
2. 點擊通知中的 LIFF 連結
3. 在編輯器中：
   - 修改標題和內文
   - 預覽圖片
   - 裁切圖片（拖曳選取區域）
   - 儲存草稿
   - 一鍵發佈

## 🔧 開發工具

### Prisma Studio

```bash
pnpm prisma:studio
```

### 建立 Migration

```bash
cd apps/backend
pnpm prisma:migrate dev --name migration_name
```

### 生成 Prisma Client

```bash
pnpm prisma:generate
```

## 🌐 本地開發與 ngrok

由於 LIFF 需要 HTTPS，本地開發時可使用 ngrok：

```bash
# 安裝 ngrok
npm install -g ngrok

# 啟動 Frontend (假設在 3000 port)
ngrok http 3000

# 將 ngrok URL 設定到 LINE Developers Console 的 LIFF URL
```

或在 `package.json` 中添加腳本：

```json
{
  "scripts": {
    "tunnel": "ngrok http 3000"
  }
}
```

## 📝 資料模型

主要資料表：

- **Post**: 文章/草稿
- **PostImage**: 文章與圖片的關聯（含裁切資訊）
- **Image**: 圖片庫（SVG）
- **HotTopic**: 熱門話題
- **StyleSample**: 風格範例

詳細 Schema 請參考 `apps/backend/prisma/schema.prisma`

## 🚧 待實作功能

- [ ] 實際的熱門話題抓取
- [ ] Meta Graph API 完整整合
- [ ] 圖片預覽 PNG 生成（後端）
- [ ] LINE Webhook 完整事件處理
- [ ] 排程任務（每日自動生成）
- [ ] 圖片庫管理介面

## 📄 License

MIT

## 👥 貢獻

歡迎提交 Issue 或 Pull Request！

