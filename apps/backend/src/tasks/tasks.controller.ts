import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('generate-daily-draft')
  @HttpCode(HttpStatus.OK)
  async generateDailyDraft() {
    return this.tasksService.generateDailyDraft();
  }

  @Get('cleanup-images')
  @HttpCode(HttpStatus.OK)
  async cleanupImages() {
    return this.tasksService.cleanupOldImages();
  }
}
