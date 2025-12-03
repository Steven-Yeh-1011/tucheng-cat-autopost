/**
 * 用於 Render Cron Jobs 的任務執行腳本
 * 
 * 開發環境用法: ts-node src/scripts/run-task.ts <task-name>
 * 生產環境用法: node dist/scripts/run-task.js <task-name>
 * 
 * 範例: 
 *   ts-node src/scripts/run-task.ts cleanup-images
 *   node dist/scripts/run-task.js cleanup-images
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TasksService } from '../tasks/tasks.service';

async function runTask(taskName: string) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app.get(TasksService);

  try {
    let result;
    switch (taskName) {
      case 'cleanup-images':
        result = await tasksService.cleanupImages();
        break;
      case 'generate-daily-draft':
        result = await tasksService.generateDailyDraft();
        break;
      default:
        console.error(`❌ 未知的任務名稱: ${taskName}`);
        console.error('可用的任務: cleanup-images, generate-daily-draft');
        process.exit(1);
    }

    console.log('✅ 任務執行成功:', JSON.stringify(result, null, 2));
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ 任務執行失敗: ${taskName}`, error);
    await app.close();
    process.exit(1);
  }
}

const taskName = process.argv[2];
if (!taskName) {
  console.error('❌ 請提供任務名稱');
  console.error('用法: node dist/scripts/run-task.js <task-name>');
  console.error('範例: node dist/scripts/run-task.js cleanup-images');
  process.exit(1);
}

runTask(taskName);


