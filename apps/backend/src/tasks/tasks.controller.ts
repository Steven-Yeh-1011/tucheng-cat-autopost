import { Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('cleanup-images')
  cleanupImages() {
    return this.tasksService.cleanupImages();
  }

  @Post('generate-daily-draft')
  generateDailyDraft() {
    return this.tasksService.generateDailyDraft();
  }
}



