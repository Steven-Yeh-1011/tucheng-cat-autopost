import { Injectable, Logger } from '@nestjs/common';
import { Platform, PostStatus, TaskStatus } from '@prisma/client';
import { PostsRepository } from '../posts/posts.repository';
import { TaskLogRepository } from './task-log.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly taskLogRepository: TaskLogRepository,
  ) {}

  async cleanupImages() {
    this.logger.log('Executing cleanup-images task');
    const log = await this.taskLogRepository.createLog('cleanup-images', TaskStatus.RUNNING);

    try {
      // TODO: implement actual cleanup logic
      await this.taskLogRepository.completeLog(log.id, TaskStatus.SUCCESS, 'Cleanup queued');
      return { task: 'cleanup-images', status: 'queued' };
    } catch (error) {
      await this.taskLogRepository.completeLog(log.id, TaskStatus.FAILED, (error as Error).message);
      throw error;
    }
  }

  async generateDailyDraft() {
    this.logger.log('Executing generate-daily-draft task');
    const log = await this.taskLogRepository.createLog('generate-daily-draft', TaskStatus.RUNNING);

    try {
      const draft = await this.postsRepository.createDraft({
        platform: Platform.META,
        content: 'Auto-generated placeholder draft',
        status: PostStatus.DRAFT,
      });

      await this.taskLogRepository.completeLog(log.id, TaskStatus.SUCCESS, 'Draft created');

      return { task: 'generate-daily-draft', status: 'queued', draftId: draft.id };
    } catch (error) {
      await this.taskLogRepository.completeLog(log.id, TaskStatus.FAILED, (error as Error).message);
      throw error;
    }
  }
}

