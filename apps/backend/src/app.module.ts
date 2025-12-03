import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit/audit-log.module';
import { HttpExceptionFilter } from './audit/http-exception.filter';
import { HttpLoggingInterceptor } from './audit/http-logging.interceptor';
import { LineModule } from './line/line.module';
import { MetaModule } from './meta/meta.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, AuditLogModule, MetaModule, LineModule, PostsModule, TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}
