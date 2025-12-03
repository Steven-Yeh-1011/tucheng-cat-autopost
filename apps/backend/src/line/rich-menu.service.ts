import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientConfig, RichMenu } from '@line/bot-sdk';
import { LineRepository } from './line.repository';

@Injectable()
export class RichMenuService {
  private readonly logger = new Logger(RichMenuService.name);
  private clients: Map<string, Client> = new Map();

  constructor(private readonly lineRepository: LineRepository) {}

  /**
   * 取得 LINE Client（根據 channelId）
   */
  private async getClient(channelId: string): Promise<Client | null> {
    // 如果已經有快取的 client，直接返回
    if (this.clients.has(channelId)) {
      const cached = this.clients.get(channelId);
      if (cached) return cached;
    }

    // 從資料庫取得憑證
    const credential = await this.lineRepository.findByChannelId(channelId);
    if (!credential || !credential.accessToken) {
      this.logger.warn(`No access token found for channel: ${channelId}`);
      return null;
    }

    // 檢查 token 是否過期
    if (credential.accessTokenExpiry && credential.accessTokenExpiry < new Date()) {
      this.logger.warn(`Access token expired for channel: ${channelId}`);
      // TODO: 實作 token 刷新邏輯
      return null;
    }

    // 建立新的 client
    const config: ClientConfig = {
      channelAccessToken: credential.accessToken,
    };

    const client = new Client(config);
    this.clients.set(channelId, client);
    return client;
  }

  /**
   * 建立 Rich Menu
   */
  async createRichMenu(channelId: string, richMenu: RichMenu): Promise<string> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Creating rich menu for channel: ${channelId}`);
      const richMenuId = await client.createRichMenu(richMenu);
      this.logger.log(`Rich menu created: ${richMenuId}`);
      return richMenuId;
    } catch (error) {
      this.logger.error(`Failed to create rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 上傳 Rich Menu 圖片
   */
  async uploadRichMenuImage(channelId: string, richMenuId: string, imageBuffer: Buffer): Promise<void> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Uploading rich menu image for: ${richMenuId}`);
      await client.setRichMenuImage(richMenuId, imageBuffer);
      this.logger.log(`Rich menu image uploaded: ${richMenuId}`);
    } catch (error) {
      this.logger.error(`Failed to upload rich menu image: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 設定預設 Rich Menu（所有用戶）
   */
  async setDefaultRichMenu(channelId: string, richMenuId: string): Promise<void> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Setting default rich menu: ${richMenuId} for channel: ${channelId}`);
      await client.setDefaultRichMenu(richMenuId);
      this.logger.log(`Default rich menu set: ${richMenuId}`);
    } catch (error) {
      this.logger.error(`Failed to set default rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 為特定用戶設定 Rich Menu
   */
  async setUserRichMenu(channelId: string, userId: string, richMenuId: string): Promise<void> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Setting rich menu ${richMenuId} for user: ${userId}`);
      await client.linkRichMenuToUser(userId, richMenuId);
      this.logger.log(`Rich menu linked to user: ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to set user rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 取得所有 Rich Menu 列表
   */
  async getRichMenuList(channelId: string): Promise<RichMenu[]> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Getting rich menu list for channel: ${channelId}`);
      const richMenus = await client.getRichMenuList();
      this.logger.log(`Found ${richMenus.length} rich menus`);
      return richMenus;
    } catch (error) {
      this.logger.error(`Failed to get rich menu list: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 取得 Rich Menu 詳情
   */
  async getRichMenu(channelId: string, richMenuId: string): Promise<RichMenu> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Getting rich menu: ${richMenuId}`);
      const richMenu = await client.getRichMenu(richMenuId);
      return richMenu;
    } catch (error) {
      this.logger.error(`Failed to get rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 刪除 Rich Menu
   */
  async deleteRichMenu(channelId: string, richMenuId: string): Promise<void> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Deleting rich menu: ${richMenuId}`);
      await client.deleteRichMenu(richMenuId);
      this.logger.log(`Rich menu deleted: ${richMenuId}`);
    } catch (error) {
      this.logger.error(`Failed to delete rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 取消設定預設 Rich Menu
   * 注意：LINE API 沒有直接取消預設 Rich Menu 的方法
   * 可以通過設定另一個 Rich Menu 為預設，或刪除當前的預設 Rich Menu
   */
  async cancelDefaultRichMenu(channelId: string): Promise<void> {
    const client = await this.getClient(channelId);
    if (!client) {
      throw new Error(`LINE client not available for channel: ${channelId}`);
    }

    try {
      this.logger.log(`Canceling default rich menu for channel: ${channelId}`);
      // LINE API 沒有 cancelDefaultRichMenu 方法
      // 可以通過取得預設 Rich Menu ID 然後刪除它，或設定為空
      // 這裡我們先記錄警告，實際操作需要先取得預設 Rich Menu ID
      this.logger.warn('cancelDefaultRichMenu: LINE API does not support direct cancellation. Please delete the default rich menu or set another one as default.');
      // 暫時不實作，因為需要先取得預設 Rich Menu ID
      // await client.deleteRichMenu(defaultRichMenuId);
    } catch (error) {
      this.logger.error(`Failed to cancel default rich menu: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 建立預設的 Rich Menu（土城浪貓專用）
   */
  async createDefaultRichMenu(channelId: string): Promise<string> {
    const defaultRichMenu: RichMenu = {
      size: {
        width: 2500,
        height: 1686,
      },
      selected: true,
      name: '土城浪貓主選單',
      chatBarText: '選單',
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: process.env.LIFF_EDITOR_URL || 'https://liff.line.me/your-liff-id',
            label: '編輯器',
          },
        },
        {
          bounds: {
            x: 833,
            y: 0,
            width: 833,
            height: 843,
          },
          action: {
            type: 'postback',
            data: 'action=view_drafts',
            label: '查看草稿',
          },
        },
        {
          bounds: {
            x: 1666,
            y: 0,
            width: 834,
            height: 843,
          },
          action: {
            type: 'postback',
            data: 'action=generate_draft',
            label: '生成草稿',
          },
        },
        {
          bounds: {
            x: 0,
            y: 843,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: 'https://www.facebook.com/your-page', // 替換為實際的 Facebook 頁面
            label: 'Facebook',
          },
        },
        {
          bounds: {
            x: 833,
            y: 843,
            width: 833,
            height: 843,
          },
          action: {
            type: 'message',
            text: '關於我們',
            label: '關於',
          },
        },
        {
          bounds: {
            x: 1666,
            y: 843,
            width: 834,
            height: 843,
          },
          action: {
            type: 'message',
            text: '聯絡我們',
            label: '聯絡',
          },
        },
      ],
    };

    return this.createRichMenu(channelId, defaultRichMenu);
  }
}

