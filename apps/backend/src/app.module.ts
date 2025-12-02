import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './line/line.module';
import { MetaModule } from './meta/meta.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, MetaModule, LineModule, PostsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
