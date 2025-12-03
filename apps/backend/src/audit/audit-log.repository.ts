import { Injectable } from '@nestjs/common';
import { AuditLog, AuditLogLevel, AuditLogType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateAuditLogInput = {
  level: AuditLogLevel;
  type: AuditLogType;
  service: string;
  action: string;
  message: string;
  details?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  userId?: string | null;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  statusCode?: number | null;
  duration?: number | null;
  error?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
};

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(input: CreateAuditLogInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: input,
    });
  }

  async findLogs(filters: {
    level?: AuditLogLevel;
    type?: AuditLogType;
    service?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const { level, type, service, action, startDate, endDate, limit = 100, offset = 0 } = filters;

    return this.prisma.auditLog.findMany({
      where: {
        level,
        type,
        service,
        action,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  async findErrorLogs(filters: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    return this.findLogs({
      ...filters,
      level: AuditLogLevel.ERROR,
    });
  }

  async findLogsByRequestId(requestId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        requestId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async countLogs(filters: {
    level?: AuditLogLevel;
    type?: AuditLogType;
    service?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<number> {
    const { level, type, service, startDate, endDate } = filters;

    return this.prisma.auditLog.count({
      where: {
        level,
        type,
        service,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}

