# 審計日誌系統使用指南

## 概述

審計日誌系統提供完整的錯誤追蹤和操作記錄功能，確保部署上線後能夠追蹤所有錯誤和操作。

## 功能特性

### 1. 自動記錄
- ✅ **HTTP 請求**：自動記錄所有 HTTP 請求（方法、路徑、狀態碼、執行時間）
- ✅ **錯誤捕獲**：全域異常過濾器自動捕獲所有錯誤
- ✅ **任務執行**：記錄所有任務的執行狀態和結果
- ✅ **API 呼叫**：記錄外部 API 呼叫（如 Google AI）

### 2. 日誌類型
- **INFO**：一般資訊日誌
- **WARN**：警告日誌
- **ERROR**：錯誤日誌
- **DEBUG**：除錯日誌（預留）

### 3. 日誌分類
- **HTTP_REQUEST**：HTTP 請求日誌
- **TASK_EXECUTION**：任務執行日誌
- **API_CALL**：外部 API 呼叫日誌
- **DATABASE_OPERATION**：資料庫操作日誌（預留）
- **SYSTEM_EVENT**：系統事件日誌
- **ERROR**：錯誤日誌

## 資料庫 Schema

### AuditLog 模型

```prisma
model AuditLog {
  id          String         @id @default(uuid())
  level       AuditLogLevel  // INFO, WARN, ERROR, DEBUG
  type        AuditLogType   // HTTP_REQUEST, TASK_EXECUTION, API_CALL, etc.
  service     String         // 服務名稱
  action      String         // 操作名稱
  message     String         // 主要訊息
  details     Json?          // 詳細資訊
  userId      String?        // 使用者 ID
  requestId   String?        // 請求 ID（用於追蹤）
  ipAddress  String?         // IP 位址
  userAgent  String?         // User Agent
  statusCode  Int?           // HTTP 狀態碼
  duration    Int?           // 執行時間（毫秒）
  error       Json?          // 錯誤資訊
  metadata    Json?          // 其他元資料
  createdAt   DateTime       @default(now())
}
```

## 部署步驟

### 1. 更新資料庫 Schema

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:db:push
# 或使用 migration（推薦）
npm run prisma:migrate:dev --name add_audit_log
```

### 2. 部署到 Render

審計日誌系統會自動啟用，無需額外配置。

## API 端點

### 查詢日誌

#### GET `/audit-logs`

查詢審計日誌

**查詢參數：**
- `level` (可選): `INFO`, `WARN`, `ERROR`, `DEBUG`
- `type` (可選): `HTTP_REQUEST`, `TASK_EXECUTION`, `API_CALL`, `SYSTEM_EVENT`, `ERROR`
- `service` (可選): 服務名稱，如 `TasksService`, `OpenAIService`
- `action` (可選): 操作名稱
- `startDate` (可選): 開始日期 (ISO 8601)
- `endDate` (可選): 結束日期 (ISO 8601)
- `limit` (可選): 每頁筆數，預設 100
- `offset` (可選): 偏移量，預設 0

**範例：**
```bash
# 查詢所有錯誤日誌
GET /audit-logs?level=ERROR&limit=50

# 查詢特定服務的日誌
GET /audit-logs?service=TasksService&type=TASK_EXECUTION

# 查詢特定時間範圍的日誌
GET /audit-logs?startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z
```

**回應：**
```json
{
  "data": [
    {
      "id": "uuid",
      "level": "ERROR",
      "type": "TASK_EXECUTION",
      "service": "TasksService",
      "action": "generate-daily-draft",
      "message": "Task failed: Google AI API 呼叫失敗",
      "details": {...},
      "error": {
        "name": "Error",
        "message": "Google AI API 呼叫失敗：...",
        "stack": "..."
      },
      "duration": 1234,
      "createdAt": "2025-01-XXT..."
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

#### GET `/audit-logs/errors`

查詢錯誤日誌（快捷方式）

**查詢參數：**
- `startDate` (可選)
- `endDate` (可選)
- `limit` (可選)
- `offset` (可選)

#### GET `/audit-logs/request?requestId=<request-id>`

根據請求 ID 查詢相關日誌（用於追蹤同一請求的所有日誌）

## 使用範例

### 在服務中記錄日誌

```typescript
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class MyService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async myMethod() {
    try {
      // 記錄資訊
      await this.auditLogService.logInfo(
        'MyService',
        'myMethod',
        'Method executed successfully',
        {
          details: { param1: 'value1' },
        }
      );

      // 執行邏輯...
    } catch (error) {
      // 記錄錯誤
      await this.auditLogService.logError(
        'MyService',
        'myMethod',
        'Method failed',
        error,
        {
          metadata: { additionalInfo: '...' },
        }
      );
      throw error;
    }
  }
}
```

### 記錄 API 呼叫

```typescript
const startTime = Date.now();
try {
  const result = await externalApi.call();
  const duration = Date.now() - startTime;
  
  await this.auditLogService.logApiCall(
    'ExternalApiService',
    'call',
    'API call successful',
    {
      success: true,
      duration,
      requestDetails: { ... },
      responseDetails: { ... },
    }
  );
} catch (error) {
  const duration = Date.now() - startTime;
  
  await this.auditLogService.logApiCall(
    'ExternalApiService',
    'call',
    'API call failed',
    {
      success: false,
      duration,
      error,
    }
  );
}
```

## 自動記錄的內容

### HTTP 請求
- ✅ 請求方法、路徑
- ✅ 狀態碼
- ✅ 執行時間
- ✅ IP 位址、User Agent
- ✅ 請求 ID（用於追蹤）
- ✅ 請求/響應體（已過濾敏感資訊）

### 錯誤
- ✅ 錯誤訊息
- ✅ 錯誤堆疊
- ✅ 請求上下文
- ✅ 時間戳記

### 任務執行
- ✅ 任務類型
- ✅ 執行狀態
- ✅ 執行時間
- ✅ 詳細資訊

## 敏感資訊處理

系統會自動過濾以下敏感欄位：
- `password`
- `secret`
- `token`
- `apiKey`
- `accessToken`
- `refreshToken`

這些欄位在日誌中會顯示為 `***REDACTED***`。

## 查詢建議

### 查詢最近的錯誤
```bash
GET /audit-logs/errors?limit=20
```

### 查詢特定任務的執行記錄
```bash
GET /audit-logs?service=TasksService&action=generate-daily-draft&limit=50
```

### 查詢特定時間範圍的錯誤
```bash
GET /audit-logs/errors?startDate=2025-01-01T00:00:00Z&endDate=2025-01-02T00:00:00Z
```

### 追蹤特定請求的所有日誌
```bash
GET /audit-logs/request?requestId=<request-id>
```

## 效能考量

- 審計日誌記錄是**非同步**的，不會阻塞主流程
- 如果日誌記錄失敗，只會記錄到 console，不會影響業務邏輯
- 建議定期清理舊日誌（可建立清理任務）

## 維護建議

1. **定期清理**：建議保留最近 30-90 天的日誌
2. **監控日誌量**：注意日誌增長速度，適時調整保留策略
3. **索引優化**：已為常用查詢欄位建立索引
4. **備份重要日誌**：錯誤日誌建議定期備份

## 相關文件

- Prisma Schema: `apps/backend/prisma/schema.prisma`
- 審計服務: `apps/backend/src/audit/audit-log.service.ts`
- HTTP 攔截器: `apps/backend/src/audit/http-logging.interceptor.ts`
- 異常過濾器: `apps/backend/src/audit/http-exception.filter.ts`

---

**建立時間：** 2025-01-XX
**版本：** 1.0.0

