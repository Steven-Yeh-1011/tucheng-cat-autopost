import { Injectable } from '@nestjs/common';
import { LineCredential, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type UpsertLineCredentialInput = {
  channelId: string;
  channelSecret?: string | null;
  accessToken?: string | null;
  accessTokenExpiry?: Date | null;
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
};

@Injectable()
export class LineRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByChannelId(channelId: string): Promise<LineCredential | null> {
    return this.prisma.lineCredential.findUnique({ where: { channelId } });
  }

  upsertCredential(input: UpsertLineCredentialInput): Promise<LineCredential> {
    const { channelId, ...data } = input;
    return this.prisma.lineCredential.upsert({
      where: { channelId },
      update: data,
      create: {
        channelId,
        ...data,
      },
    });
  }
}

