import { Injectable, Logger } from '@nestjs/common';
import { Platform, PostStatus, TaskStatus } from '@prisma/client';
import { AuditLogService } from '../audit/audit-log.service';
import { OpenAIService } from '../openai/openai.service';
import { PostsRepository } from '../posts/posts.repository';
import { TaskLogRepository } from './task-log.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly taskLogRepository: TaskLogRepository,
    private readonly openAIService: OpenAIService,
    private readonly auditLogService: AuditLogService,
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
    const startTime = Date.now();
    let log;
    
    try {
      log = await this.taskLogRepository.createLog('generate-daily-draft', TaskStatus.RUNNING);
      this.logger.log(`Task log created: ${log.id}`);

      // 檢查 Google AI 服務是否可用
      if (!this.openAIService.isAvailable()) {
        this.logger.warn('Google AI service is not available, falling back to placeholder draft');
        const draft = await this.postsRepository.createDraft({
          platform: Platform.META,
          content: 'Auto-generated placeholder draft (Google AI not configured)',
          status: PostStatus.DRAFT,
          metadata: {
            source: 'placeholder',
            reason: 'GOOGLE_AI_API_KEY not set',
          },
        });
        await this.taskLogRepository.completeLog(
          log.id, 
          TaskStatus.SUCCESS, 
          `Placeholder draft created: ${draft.id} (Google AI not available)`
        );
        
        const duration = Date.now() - startTime;
        await this.auditLogService.logTaskExecution(
          'generate-daily-draft',
          'success',
          `Placeholder draft created: ${draft.id}`,
          {
            duration,
            details: { draftId: draft.id, source: 'placeholder' },
            requestId: log.id,
          },
        );
        
        return { task: 'generate-daily-draft', status: 'success', draftId: draft.id, source: 'placeholder' };
      }

      // 使用 Google AI 生成草稿內容
      this.logger.log('Generating draft content with Google AI...');
      const aiStartTime = Date.now();
      const content = await this.openAIService.generateDraftContent({
        topic: '土城浪貓',
        tone: '溫暖、友善',
        length: 'medium',
      });
      const aiDuration = Date.now() - aiStartTime;

      // 記錄 AI API 呼叫
      await this.auditLogService.logApiCall(
        'OpenAIService',
        'generateDraftContent',
        'AI draft content generated successfully',
        {
          success: true,
          duration: aiDuration,
          requestDetails: { topic: '土城浪貓', tone: '溫暖、友善', length: 'medium' },
          responseDetails: { contentLength: content.length },
          requestId: log.id,
        },
      );

      this.logger.log('Creating draft with AI-generated content...');
      const draft = await this.postsRepository.createDraft({
        platform: Platform.META,
        content,
        status: PostStatus.DRAFT,
        metadata: {
          source: 'google-ai',
          model: 'gemini-1.5-flash',
          generatedAt: new Date().toISOString(),
        },
      });

      this.logger.log(`Draft created successfully: ${draft.id}`);
      await this.taskLogRepository.completeLog(
        log.id, 
        TaskStatus.SUCCESS, 
        `AI draft created: ${draft.id} (${content.length} characters)`
      );

      const duration = Date.now() - startTime;
      await this.auditLogService.logTaskExecution(
        'generate-daily-draft',
        'success',
        `AI draft created: ${draft.id}`,
        {
          duration,
          details: { draftId: draft.id, contentLength: content.length, source: 'google-ai', aiDuration },
          requestId: log.id,
        },
      );

      return { task: 'generate-daily-draft', status: 'success', draftId: draft.id, source: 'google-ai' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const duration = Date.now() - startTime;
      
      this.logger.error(`generate-daily-draft failed: ${errorMessage}`, errorStack);
      
      // 記錄錯誤到審計日誌
      await this.auditLogService.logTaskExecution(
        'generate-daily-draft',
        'failed',
        `Task failed: ${errorMessage}`,
        {
          duration,
          error,
          requestId: log?.id,
        },
      );
      
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

