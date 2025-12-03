import { Injectable, Logger } from '@nestjs/common';
import { AuditLogLevel, AuditLogType } from '@prisma/client';
import { AuditLogRepository, CreateAuditLogInput } from './audit-log.repository';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  /**
   * 記錄資訊日誌
   */
  async logInfo(
    service: string,
    action: string,
    message: string,
    options?: {
      details?: any;
      requestId?: string;
      userId?: string;
      metadata?: any;
    },
  ): Promise<void> {
    try {
      await this.auditLogRepository.createLog({
        level: AuditLogLevel.INFO,
        type: AuditLogType.SYSTEM_EVENT,
        service,
        action,
        message,
        details: options?.details ? JSON.parse(JSON.stringify(options.details)) : null,
        requestId: options?.requestId || null,
        userId: options?.userId || null,
        metadata: options?.metadata ? JSON.parse(JSON.stringify(options.metadata)) : null,
      });
    } catch (error) {
      // 審計日誌失敗不應影響主流程，只記錄到 console
      this.logger.error(`Failed to create audit log: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 記錄警告日誌
   */
  async logWarn(
    service: string,
    action: string,
    message: string,
    options?: {
      details?: any;
      requestId?: string;
      userId?: string;
      metadata?: any;
    },
  ): Promise<void> {
    try {
      await this.auditLogRepository.createLog({
        level: AuditLogLevel.WARN,
        type: AuditLogType.SYSTEM_EVENT,
        service,
        action,
        message,
        details: options?.details ? JSON.parse(JSON.stringify(options.details)) : null,
        requestId: options?.requestId || null,
        userId: options?.userId || null,
        metadata: options?.metadata ? JSON.parse(JSON.stringify(options.metadata)) : null,
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 記錄錯誤日誌
   */
  async logError(
    service: string,
    action: string,
    message: string,
    error: Error | unknown,
    options?: {
      requestId?: string;
      userId?: string;
      statusCode?: number;
      metadata?: any;
    },
  ): Promise<void> {
    try {
      const errorDetails = error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : { message: String(error) };

      await this.auditLogRepository.createLog({
        level: AuditLogLevel.ERROR,
        type: AuditLogType.ERROR,
        service,
        action,
        message,
        error: errorDetails || undefined,
        requestId: options?.requestId || null,
        userId: options?.userId || null,
        statusCode: options?.statusCode || null,
        metadata: options?.metadata ? JSON.parse(JSON.stringify(options.metadata)) : null,
      });
    } catch (logError) {
      // 審計日誌失敗不應影響主流程
      this.logger.error(`Failed to create audit log: ${logError instanceof Error ? logError.message : String(logError)}`);
    }
  }

  /**
   * 記錄 HTTP 請求
   */
  async logHttpRequest(
    method: string,
    path: string,
    statusCode: number,
    options?: {
      requestId?: string;
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      duration?: number;
      requestBody?: any;
      responseBody?: any;
      error?: Error | unknown;
    },
  ): Promise<void> {
    try {
      const level =
        statusCode >= 500
          ? AuditLogLevel.ERROR
          : statusCode >= 400
            ? AuditLogLevel.WARN
            : AuditLogLevel.INFO;

      const errorDetails = options?.error
        ? options.error instanceof Error
          ? {
              name: options.error.name,
              message: options.error.message,
              stack: options.error.stack,
            }
          : { message: String(options.error) }
        : undefined;

      await this.auditLogRepository.createLog({
        level,
        type: AuditLogType.HTTP_REQUEST,
        service: 'HttpService',
        action: `${method} ${path}`,
        message: `${method} ${path} - ${statusCode}`,
        details: {
          method,
          path,
          statusCode,
          requestBody: options?.requestBody ? JSON.parse(JSON.stringify(options.requestBody)) : null,
          responseBody: options?.responseBody ? JSON.parse(JSON.stringify(options.responseBody)) : null,
        },
        requestId: options?.requestId || null,
        userId: options?.userId || null,
        ipAddress: options?.ipAddress || null,
        userAgent: options?.userAgent || null,
        statusCode,
        duration: options?.duration || null,
        error: errorDetails || undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 記錄 API 呼叫（外部服務）
   */
  async logApiCall(
    service: string,
    action: string,
    message: string,
    options?: {
      success: boolean;
      duration?: number;
      requestDetails?: any;
      responseDetails?: any;
      error?: Error | unknown;
      requestId?: string;
    },
  ): Promise<void> {
    try {
      const level = options?.success ? AuditLogLevel.INFO : AuditLogLevel.ERROR;

      const errorDetails = options?.error
        ? options.error instanceof Error
          ? {
              name: options.error.name,
              message: options.error.message,
              stack: options.error.stack,
            }
          : { message: String(options.error) }
        : null;

      await this.auditLogRepository.createLog({
        level,
        type: AuditLogType.API_CALL,
        service,
        action,
        message,
        details: {
          success: options?.success,
          requestDetails: options?.requestDetails ? JSON.parse(JSON.stringify(options.requestDetails)) : null,
          responseDetails: options?.responseDetails ? JSON.parse(JSON.stringify(options.responseDetails)) : null,
        },
        duration: options?.duration || null,
        error: errorDetails || undefined,
        requestId: options?.requestId || null,
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 記錄任務執行
   */
  async logTaskExecution(
    taskType: string,
    status: 'success' | 'failed',
    message: string,
    options?: {
      duration?: number;
      details?: any;
      error?: Error | unknown;
      requestId?: string;
    },
  ): Promise<void> {
    try {
      const level = status === 'success' ? AuditLogLevel.INFO : AuditLogLevel.ERROR;

      const errorDetails = options?.error
        ? options.error instanceof Error
          ? {
              name: options.error.name,
              message: options.error.message,
              stack: options.error.stack,
            }
          : { message: String(options.error) }
        : null;

      await this.auditLogRepository.createLog({
        level,
        type: AuditLogType.TASK_EXECUTION,
        service: 'TasksService',
        action: taskType,
        message,
        details: options?.details ? JSON.parse(JSON.stringify(options.details)) : null,
        duration: options?.duration || null,
        error: errorDetails || undefined,
        requestId: options?.requestId || null,
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

