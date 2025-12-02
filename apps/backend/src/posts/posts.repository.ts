import { Injectable } from '@nestjs/common';
import { Platform, PostDraft, PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type CreateDraftInput = {
  platform: Platform;
  content: string;
  status?: PostStatus;
  title?: string | null;
  mediaUrls?: string[];
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  scheduledAt?: Date | null;
  metaCredentialId?: string | null;
  lineCredentialId?: string | null;
};

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createDraft(input: CreateDraftInput): Promise<PostDraft> {
    return this.prisma.postDraft.create({
      data: {
        platform: input.platform,
        content: input.content,
        status: input.status ?? PostStatus.DRAFT,
        title: input.title ?? null,
        mediaUrls: input.mediaUrls ?? [],
        metadata: input.metadata,
        scheduledAt: input.scheduledAt ?? null,
        metaCredentialId: input.metaCredentialId ?? null,
        lineCredentialId: input.lineCredentialId ?? null,
      },
    });
  }

  updateStatus(
    id: string,
    status: PostStatus,
    metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput,
  ): Promise<PostDraft> {
    return this.prisma.postDraft.update({
      where: { id },
      data: {
        status,
        metadata,
      },
    });
  }

  findScheduled(after?: Date): Promise<PostDraft[]> {
    return this.prisma.postDraft.findMany({
      where: {
        status: PostStatus.SCHEDULED,
        scheduledAt: after ? { gte: after } : undefined,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  listDrafts(status?: PostStatus): Promise<PostDraft[]> {
    return this.prisma.postDraft.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}

