import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsModule } from '../posts/posts.module';
import { TaskLogRepository } from './task-log.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule, PostsModule],
  controllers: [TasksController],
  providers: [TasksService, TaskLogRepository],
})
export class TasksModule {}

