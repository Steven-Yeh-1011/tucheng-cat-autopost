import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LineRepository } from './line.repository';

@Injectable()
export class LineService {
  private readonly logger = new Logger(LineService.name);

  constructor(private readonly lineRepository: LineRepository) {}

  async handleWebhook(payload: unknown) {
    this.logger.log('Received LINE webhook event');
    // TODO: add signature verification and event handling logic

    try {
      await this.lineRepository.upsertCredential({
        channelId: 'default-channel',
        metadata: payload as Prisma.InputJsonValue,
      });
    } catch (error) {
      this.logger.error('Failed to persist LINE webhook snapshot', error as Error);
    }

    return { ok: true };
  }
}

