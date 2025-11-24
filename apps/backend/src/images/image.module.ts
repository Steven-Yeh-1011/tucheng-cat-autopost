import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImageService } from './image.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImageService],
  exports: [ImageService],
})
export class ImageModule {}

