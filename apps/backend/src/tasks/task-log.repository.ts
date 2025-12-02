import { Injectable } from '@nestjs/common';
import { Prisma, TaskLog, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLog(
    taskType: string,
    status: TaskStatus,
    payload?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput,
  ): Promise<TaskLog> {
    return this.prisma.taskLog.create({
      data: {
        taskType,
        status,
        payload,
      },
    });
  }

  completeLog(id: string, status: TaskStatus, message?: string): Promise<TaskLog> {
    return this.prisma.taskLog.update({
      where: { id },
      data: {
        status,
        message,
        completedAt: new Date(),
      },
    });
  }
}

