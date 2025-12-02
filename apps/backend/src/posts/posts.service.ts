import { Injectable } from '@nestjs/common';
import { Platform, PostStatus, Prisma } from '@prisma/client';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftStatusDto } from './dto/update-draft-status.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  createDraft(dto: CreateDraftDto) {
    const scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : undefined;

    return this.postsRepository.createDraft({
      platform: dto.platform ?? Platform.META,
      content: dto.content,
      status: PostStatus.DRAFT,
      title: dto.title,
      mediaUrls: dto.mediaUrls,
      metadata: dto.metadata as Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined,
      scheduledAt,
      metaCredentialId: dto.metaCredentialId,
      lineCredentialId: dto.lineCredentialId,
    });
  }

  listDrafts(status?: PostStatus) {
    return this.postsRepository.listDrafts(status);
  }

  updateStatus(id: string, dto: UpdateDraftStatusDto) {
    return this.postsRepository.updateStatus(
      id,
      dto.status,
      dto.metadata as Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined,
    );
  }
}

