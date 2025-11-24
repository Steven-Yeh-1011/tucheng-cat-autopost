import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, MessageAPIResponseBase, messagingApi } from '@line/bot-sdk';

@Injectable()
export class LineService {
  private readonly logger = new Logger(LineService.name);
  private readonly client: Client;
  private readonly userId: string;

  constructor(private configService: ConfigService) {
    const channelAccessToken = this.configService.get<string>('LINE_CHANNEL_ACCESS_TOKEN');
    this.userId = this.configService.get<string>('LINE_USER_ID') || '';

    if (!channelAccessToken) {
      this.logger.warn('LINE_CHANNEL_ACCESS_TOKEN not set, LINE features will be mocked');
      this.client = null as any;
    } else {
      this.client = new Client({
        channelAccessToken,
      });
    }
  }

  /**
   * Send draft notification via LINE
   */
  async sendDraftNotification(postId: string, liffUrl: string): Promise<void> {
    if (!this.client || !this.userId) {
      this.logger.log(`[Mock] Would send LINE notification for post ${postId} with LIFF URL: ${liffUrl}`);
      return;
    }

    try {
      const message: messagingApi.FlexMessage = {
        type: 'flex',
        altText: '草稿待審核',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '📝 新草稿待審核',
                weight: 'bold',
                size: 'xl',
              },
              {
                type: 'text',
                text: '點擊下方按鈕開始編輯',
                margin: 'md',
                wrap: true,
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                action: {
                  type: 'uri',
                  label: '開始編輯',
                  uri: liffUrl,
                },
              },
            ],
          },
        },
      };

      await this.client.pushMessage(this.userId, message);
      this.logger.log(`Sent LINE notification for post ${postId}`);
    } catch (error) {
      this.logger.error('Failed to send LINE notification:', error);
    }
  }
}

