import { Controller, Get, Post, Query } from '@nestjs/common';
import { RichMenuService } from './rich-menu.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Rich Menu 一鍵部署控制器
 * 使用 Puppeteer 生成的圖片自動部署 Rich Menu
 */
@Controller('line/rich-menu-deploy')
export class RichMenuDeployController {
  constructor(private readonly richMenuService: RichMenuService) {}

  /**
   * 一鍵部署 Rich Menu（使用 Puppeteer 生成的圖片）
   * 
   * 這個端點會：
   * 1. 檢查是否有生成的圖片（rich-menu-dashboard.png）
   * 2. 建立 Rich Menu
   * 3. 上傳圖片
   * 4. 設定為預設 Rich Menu
   * 
   * 使用方式：
   * POST /line/rich-menu-deploy/auto?channelId=your-channel-id
   */
  @Post('auto')
  async autoDeploy(@Query('channelId') channelId: string) {
    if (!channelId) {
      return { 
        error: 'channelId is required',
        message: '請提供 channelId 查詢參數，例如：/line/rich-menu-deploy/auto?channelId=your-channel-id'
      };
    }

    try {
      // 1. 檢查圖片是否存在
      const imagePath = path.join(process.cwd(), 'rich-menu-dashboard.png');
      if (!fs.existsSync(imagePath)) {
        return {
          error: 'Rich menu image not found',
          message: '找不到 rich-menu-dashboard.png 圖片。請先執行 generate-rich-menu.ts 腳本生成圖片。',
          hint: '在後端目錄執行：npm run rich-menu:generate'
        };
      }

      // 2. 讀取圖片
      const imageBuffer = fs.readFileSync(imagePath);

      // 3. 建立預設 Rich Menu
      const richMenuId = await this.richMenuService.createDefaultRichMenu(channelId);
      
      // 4. 上傳圖片
      await this.richMenuService.uploadRichMenuImage(channelId, richMenuId, imageBuffer);
      
      // 5. 設定為預設 Rich Menu
      await this.richMenuService.setDefaultRichMenu(channelId, richMenuId);

      return {
        success: true,
        message: 'Rich Menu 部署成功！',
        richMenuId,
        steps: [
          '✅ Rich Menu 已建立',
          '✅ 圖片已上傳',
          '✅ 已設定為預設 Rich Menu'
        ],
        note: 'Rich Menu 可能需要幾分鐘才會在 LINE 中顯示。請重新開啟 LINE 聊天室查看。'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        error: 'Deployment failed',
        message: errorMessage,
        troubleshooting: [
          '1. 確認 LINE_CHANNEL_ACCESS_TOKEN 環境變數已設定',
          '2. 確認 channelId 正確',
          '3. 確認已執行 generate-rich-menu.ts 生成圖片',
          '4. 檢查後端日誌以獲取詳細錯誤信息'
        ]
      };
    }
  }

  /**
   * 檢查 Rich Menu 部署狀態
   * 
   * GET /line/rich-menu-deploy/status?channelId=your-channel-id
   */
  @Get('status')
  async checkStatus(@Query('channelId') channelId: string) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }

    try {
      const richMenus = await this.richMenuService.getRichMenuList(channelId);
      const imagePath = path.join(process.cwd(), 'rich-menu-dashboard.png');
      const imageExists = fs.existsSync(imagePath);

      return {
        channelId,
        richMenuCount: richMenus.length,
        richMenus: richMenus.map(rm => ({
          richMenuId: (rm as any).richMenuId || 'unknown',
          name: rm.name,
          size: rm.size,
        })),
        imageExists,
        environment: {
          hasAccessToken: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
          hasLiffUrl: !!process.env.LIFF_URL,
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        error: 'Failed to check status',
        message: errorMessage
      };
    }
  }
}

