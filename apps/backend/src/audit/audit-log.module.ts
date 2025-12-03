import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogController } from './audit-log.controller';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogController],
  providers: [AuditLogRepository, AuditLogService],
  exports: [AuditLogService, AuditLogRepository],
})
export class AuditLogModule {}

