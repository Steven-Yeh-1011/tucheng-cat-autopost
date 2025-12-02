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
    let log;
    
    try {
      log = await this.taskLogRepository.createLog('generate-daily-draft', TaskStatus.RUNNING);
      this.logger.log(`Task log created: ${log.id}`);

      this.logger.log('Creating draft...');
      const draft = await this.postsRepository.createDraft({
        platform: Platform.META,
        content: 'Auto-generated placeholder draft',
        status: PostStatus.DRAFT,
      });

      this.logger.log(`Draft created successfully: ${draft.id}`);
      await this.taskLogRepository.completeLog(log.id, TaskStatus.SUCCESS, `Draft created: ${draft.id}`);

      return { task: 'generate-daily-draft', status: 'success', draftId: draft.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(`generate-daily-draft failed: ${errorMessage}`, errorStack);
      
      if (log) {
        await this.taskLogRepository.completeLog(
          log.id, 
          TaskStatus.FAILED, 
          `Error: ${errorMessage}${errorStack ? `\nStack: ${errorStack}` : ''}`
        ).catch((logError) => {
          this.logger.error(`Failed to update task log: ${logError}`);
        });
      }
      
      throw error;
    }
  }
}

