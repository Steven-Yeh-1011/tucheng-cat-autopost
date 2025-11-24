import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ImageModule } from '../images/image.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [ImageModule, MetaModule],
})
export class PostsModule {}

