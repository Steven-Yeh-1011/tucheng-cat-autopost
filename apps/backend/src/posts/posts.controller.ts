import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftStatusDto } from './dto/update-draft-status.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('drafts')
  listDrafts(@Query('status') status?: PostStatus) {
    return this.postsService.listDrafts(status);
  }

  @Post('drafts')
  createDraft(@Body() body: CreateDraftDto) {
    return this.postsService.createDraft(body);
  }

  @Patch('drafts/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateDraftStatusDto) {
    return this.postsService.updateStatus(id, body);
  }
}


