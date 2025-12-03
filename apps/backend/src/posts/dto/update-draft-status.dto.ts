import { PostStatus } from '@prisma/client';

export class UpdateDraftStatusDto {
  status!: PostStatus;
  metadata?: Record<string, unknown>;
}



