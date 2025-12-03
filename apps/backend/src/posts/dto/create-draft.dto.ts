import { Platform } from '@prisma/client';

export class CreateDraftDto {
  platform!: Platform;
  content!: string;
  title?: string | null;
  mediaUrls?: string[];
  metadata?: Record<string, unknown>;
  scheduledAt?: string | null;
  metaCredentialId?: string | null;
  lineCredentialId?: string | null;
}



