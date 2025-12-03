import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuditLogLevel, AuditLogType } from '@prisma/client';
import { AuditLogRepository } from './audit-log.repository';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  @Get()
  async getLogs(
    @Query('level') level?: AuditLogLevel,
    @Query('type') type?: AuditLogType,
    @Query('service') service?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const logs = await this.auditLogRepository.findLogs({
      level,
      type,
      service,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });

    const total = await this.auditLogRepository.countLogs({
      level,
      type,
      service,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return {
      data: logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: (offset || 0) + (limit || 100) < total,
      },
    };
  }

  @Get('errors')
  async getErrorLogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const logs = await this.auditLogRepository.findErrorLogs({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });

    return {
      data: logs,
      pagination: {
        limit,
        offset,
      },
    };
  }

  @Get('request')
  async getLogsByRequestId(@Query('requestId') requestId: string) {
    if (!requestId) {
      return { error: 'requestId query parameter is required' };
    }
    const logs = await this.auditLogRepository.findLogsByRequestId(requestId);
    return { data: logs };
  }
}

