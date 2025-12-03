import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggingInterceptor.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    // 生成請求 ID（如果沒有）
    const requestId = (request.headers['x-request-id'] as string) || uuidv4();
    request.headers['x-request-id'] = requestId;
    response.setHeader('X-Request-Id', requestId);

    // 過濾敏感資訊（如密碼、token）
    const sanitizedBody = this.sanitizeRequestBody(body);

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // 記錄成功的請求（非同步，不等待完成）
        this.auditLogService
          .logHttpRequest(method, url, statusCode, {
            requestId,
            ipAddress: ip,
            userAgent,
            duration,
            requestBody: sanitizedBody,
            responseBody: this.sanitizeResponseBody(data),
          })
          .catch((logError) => {
            this.logger.error(`Failed to log HTTP request: ${logError}`);
          });

        this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms [${requestId}]`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // 記錄錯誤的請求（非同步，不等待完成）
        this.auditLogService
          .logHttpRequest(method, url, statusCode, {
            requestId,
            ipAddress: ip,
            userAgent,
            duration,
            requestBody: sanitizedBody,
            error,
          })
          .catch((logError) => {
            this.logger.error(`Failed to log HTTP error: ${logError}`);
          });

        this.logger.error(
          `${method} ${url} ${statusCode} - ${duration}ms [${requestId}] - ${error.message}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }

  /**
   * 過濾請求體中的敏感資訊
   */
  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'secret', 'token', 'apiKey', 'accessToken', 'refreshToken'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  /**
   * 過濾響應體中的敏感資訊
   */
  private sanitizeResponseBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    // 只記錄響應的基本資訊，避免記錄大量資料
    if (Array.isArray(body)) {
      return { type: 'array', length: body.length };
    }

    const keys = Object.keys(body);
    if (keys.length > 10) {
      return { type: 'object', keys: keys.slice(0, 10), totalKeys: keys.length };
    }

    return this.sanitizeRequestBody(body);
  }
}

