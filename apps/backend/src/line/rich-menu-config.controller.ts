import { Controller, Get, Query } from '@nestjs/common';

export type RichMenuButton = {
  id: string;
  label: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action: {
    type: 'uri' | 'postback' | 'message';
    uri?: string;
    data?: string;
    text?: string;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    icon?: string;
  };
};

export type RichMenuConfig = {
  id: string;
  name: string;
  size: {
    width: number;
    height: number;
  };
  buttons: RichMenuButton[];
};

@Controller('line/rich-menu-config')
export class RichMenuConfigController {
  /**
   * 取得 Rich Menu 配置（CSS 版本）
   * 這個配置用於在 LIFF 中動態渲染 Rich Menu
   */
  @Get()
  getRichMenuConfig(@Query('channelId') channelId?: string): RichMenuConfig {
    // 使用相對路徑，前端會自動處理
    // 如果需要絕對路徑，可以從環境變數取得
    const useAbsoluteUrl = process.env.LIFF_USE_ABSOLUTE_URL === 'true';
    const baseUrl = useAbsoluteUrl 
      ? (process.env.LIFF_BASE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '')
      : '';
    
    return {
      id: 'tucheng-cat-default',
      name: '土城浪貓主選單',
      size: {
        width: 2500,
        height: 1686,
      },
      buttons: [
        {
          id: 'editor',
          label: '編輯器',
          position: {
            x: 0,
            y: 0,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: baseUrl ? `${baseUrl}/editor` : '/editor',
          },
          style: {
            backgroundColor: '#4F46E5',
            textColor: '#FFFFFF',
            icon: '✏️',
          },
        },
        {
          id: 'view-drafts',
          label: '查看草稿',
          position: {
            x: 833,
            y: 0,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: baseUrl ? `${baseUrl}/drafts` : '/drafts',
          },
          style: {
            backgroundColor: '#10B981',
            textColor: '#FFFFFF',
            icon: '📋',
          },
        },
        {
          id: 'generate-draft',
          label: '生成草稿',
          position: {
            x: 1666,
            y: 0,
            width: 834,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: baseUrl ? `${baseUrl}/generate` : '/generate',
          },
          style: {
            backgroundColor: '#F59E0B',
            textColor: '#FFFFFF',
            icon: '✨',
          },
        },
        {
          id: 'facebook',
          label: 'Facebook',
          position: {
            x: 0,
            y: 843,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: 'https://www.facebook.com/your-page', // 替換為實際的 Facebook 頁面
          },
          style: {
            backgroundColor: '#1877F2',
            textColor: '#FFFFFF',
            icon: '📘',
          },
        },
        {
          id: 'about',
          label: '關於',
          position: {
            x: 833,
            y: 843,
            width: 833,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: baseUrl ? `${baseUrl}/about` : '/about',
          },
          style: {
            backgroundColor: '#6B7280',
            textColor: '#FFFFFF',
            icon: 'ℹ️',
          },
        },
        {
          id: 'contact',
          label: '聯絡',
          position: {
            x: 1666,
            y: 843,
            width: 834,
            height: 843,
          },
          action: {
            type: 'uri',
            uri: baseUrl ? `${baseUrl}/contact` : '/contact',
          },
          style: {
            backgroundColor: '#EF4444',
            textColor: '#FFFFFF',
            icon: '📞',
          },
        },
      ],
    };
  }
}

