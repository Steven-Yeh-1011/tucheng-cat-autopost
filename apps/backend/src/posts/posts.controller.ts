import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string) {
    return this.postsService.publish(id);
  }
}

