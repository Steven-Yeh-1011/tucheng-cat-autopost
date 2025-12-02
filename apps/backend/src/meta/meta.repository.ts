import { Injectable } from '@nestjs/common';
import { MetaCredential, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type UpsertMetaCredentialInput = {
  pageId: string;
  pageName?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
};

@Injectable()
export class MetaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByPageId(pageId: string): Promise<MetaCredential | null> {
    return this.prisma.metaCredential.findUnique({ where: { pageId } });
  }

  async upsertCredential(input: UpsertMetaCredentialInput): Promise<MetaCredential> {
    const { pageId, ...data } = input;
    return this.prisma.metaCredential.upsert({
      where: { pageId },
      update: data,
      create: {
        pageId,
        ...data,
      },
    });
  }
}

