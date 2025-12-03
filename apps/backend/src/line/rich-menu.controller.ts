import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RichMenuService } from './rich-menu.service';

@Controller('line/rich-menu')
export class RichMenuController {
  constructor(private readonly richMenuService: RichMenuService) {}

  /**
   * 建立 Rich Menu
   */
  @Post()
  async createRichMenu(
    @Query('channelId') channelId: string,
    @Body() richMenu: any,
  ) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    const richMenuId = await this.richMenuService.createRichMenu(channelId, richMenu);
    return { richMenuId };
  }

  /**
   * 建立預設的 Rich Menu
   */
  @Post('default')
  async createDefaultRichMenu(@Query('channelId') channelId: string) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    const richMenuId = await this.richMenuService.createDefaultRichMenu(channelId);
    return { richMenuId, message: 'Default rich menu created. Please upload image and set as default.' };
  }

  /**
   * 上傳 Rich Menu 圖片
   */
  @Post(':richMenuId/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadRichMenuImage(
    @Param('richMenuId') richMenuId: string,
    @Query('channelId') channelId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    if (!file) {
      return { error: 'Image file is required' };
    }

    // 驗證圖片格式
    if (!file.mimetype.startsWith('image/')) {
      return { error: 'File must be an image' };
    }

    // 驗證圖片尺寸（Rich Menu 必須是 2500x1686 或 2500x843）
    // 這裡只做基本檢查，實際尺寸驗證可以在前端或使用圖片處理庫

    await this.richMenuService.uploadRichMenuImage(
      channelId,
      richMenuId,
      file.buffer,
    );

    return { message: 'Rich menu image uploaded successfully', richMenuId };
  }

  /**
   * 設定為預設 Rich Menu
   */
  @Post(':richMenuId/set-default')
  async setDefaultRichMenu(
    @Param('richMenuId') richMenuId: string,
    @Query('channelId') channelId: string,
  ) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    await this.richMenuService.setDefaultRichMenu(channelId, richMenuId);
    return { message: 'Default rich menu set successfully', richMenuId };
  }

  /**
   * 為特定用戶設定 Rich Menu
   */
  @Post(':richMenuId/set-user')
  async setUserRichMenu(
    @Param('richMenuId') richMenuId: string,
    @Query('channelId') channelId: string,
    @Query('userId') userId: string,
  ) {
    if (!channelId || !userId) {
      return { error: 'channelId and userId are required' };
    }
    await this.richMenuService.setUserRichMenu(channelId, userId, richMenuId);
    return { message: 'User rich menu set successfully', richMenuId, userId };
  }

  /**
   * 取得 Rich Menu 列表
   */
  @Get()
  async getRichMenuList(@Query('channelId') channelId: string) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    const richMenus = await this.richMenuService.getRichMenuList(channelId);
    return { data: richMenus };
  }

  /**
   * 取得 Rich Menu 詳情
   */
  @Get(':richMenuId')
  async getRichMenu(
    @Param('richMenuId') richMenuId: string,
    @Query('channelId') channelId: string,
  ) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    const richMenu = await this.richMenuService.getRichMenu(channelId, richMenuId);
    return { data: richMenu };
  }

  /**
   * 刪除 Rich Menu
   */
  @Delete(':richMenuId')
  async deleteRichMenu(
    @Param('richMenuId') richMenuId: string,
    @Query('channelId') channelId: string,
  ) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    await this.richMenuService.deleteRichMenu(channelId, richMenuId);
    return { message: 'Rich menu deleted successfully', richMenuId };
  }

  /**
   * 取消預設 Rich Menu
   */
  @Delete('default')
  async cancelDefaultRichMenu(@Query('channelId') channelId: string) {
    if (!channelId) {
      return { error: 'channelId is required' };
    }
    await this.richMenuService.cancelDefaultRichMenu(channelId);
    return { message: 'Default rich menu canceled successfully' };
  }
}

