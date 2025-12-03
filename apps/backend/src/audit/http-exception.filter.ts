import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditLogService } from './audit-log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || 'unknown';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorDetails =
      exception instanceof Error
        ? {
            name: exception.name,
            message: exception.message,
            stack: exception.stack,
          }
        : { message: String(exception) };

    // 記錄錯誤到審計日誌（非同步，不等待完成）
    this.auditLogService
      .logError(
        'HttpExceptionFilter',
        `${request.method} ${request.url}`,
        `HTTP ${status}: ${typeof message === 'string' ? message : JSON.stringify(message)}`,
        exception instanceof Error ? exception : new Error(String(exception)),
        {
          requestId,
          statusCode: status,
          metadata: {
            method: request.method,
            url: request.url,
            ip: request.ip,
            userAgent: request.headers['user-agent'],
          },
        },
      )
      .catch((logError) => {
        this.logger.error(`Failed to log error to audit: ${logError}`);
      });

    // 記錄到控制台
    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    // 回傳錯誤響應
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      message: typeof message === 'string' ? message : (message as any).message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: errorDetails }),
    });
  }
}

