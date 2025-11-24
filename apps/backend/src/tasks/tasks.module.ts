import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { OpenAIModule } from '../openai/openai.module';
import { LineModule } from '../line/line.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [OpenAIModule, LineModule],
})
export class TasksModule {}

