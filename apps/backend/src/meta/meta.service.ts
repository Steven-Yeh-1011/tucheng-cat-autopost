import { Injectable, Logger } from '@nestjs/common';
import { MetaRepository } from './meta.repository';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(private readonly metaRepository: MetaRepository) {}

  async handleAuthorizationCallback(code: string | undefined, state: string | undefined) {
    this.logger.log(`Received Meta auth callback code=${code ?? 'n/a'} state=${state ?? 'n/a'}`);

    const pageIdFromState = state ?? 'pending-page';

    try {
      await this.metaRepository.upsertCredential({
        pageId: pageIdFromState,
        metadata: {
          lastAuthorizationCode: code,
          receivedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to persist Meta authorization snapshot', error as Error);
    }

    // TODO: exchange the code for access token and update credential with real tokens
    return { success: true, code, state };
  }
}

