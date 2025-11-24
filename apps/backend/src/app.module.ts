import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/image.module';
import { TasksModule } from './tasks/tasks.module';
import { LineModule } from './line/line.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PostsModule,
    ImagesModule,
    TasksModule,
    LineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
