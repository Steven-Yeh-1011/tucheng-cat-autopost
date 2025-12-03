import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit/audit-log.module';
import { OpenAIModule } from '../openai/openai.module';
import { PostsModule } from '../posts/posts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskLogRepository } from './task-log.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule, PostsModule, OpenAIModule, AuditLogModule],
  controllers: [TasksController],
  providers: [TasksService, TaskLogRepository],
})
export class TasksModule {}

