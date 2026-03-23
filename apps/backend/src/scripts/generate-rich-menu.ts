import puppeteer from 'puppeteer';
import { Client, RichMenu } from '@line/bot-sdk';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// 載入環境變數（從專案根目錄）
// 專案根目錄位於 apps/backend 的上兩層
const projectRoot = path.resolve(__dirname, '../../..');
dotenv.config({ path: path.join(projectRoot, '.env') });

// Rich Menu 尺寸（LINE 官方規格）
const RICH_MENU_WIDTH = 2500;
const RICH_MENU_HEIGHT = 1686;

// 按鈕配置（3列 x 2行）
const BUTTON_CONFIG = [
  { id: 'editor', label: '編輯器', icon: '✏️', color: '#4F46E5', uri: '/editor' },
  { id: 'view-drafts', label: '查看草稿', icon: '📋', color: '#10B981', uri: '/drafts' },
  { id: 'generate-draft', label: '生成草稿', icon: '✨', color: '#F59E0B', uri: '/generate' },
  { id: 'dashboard', label: '主選單', icon: '🏠', color: '#1877F2', uri: '/dashboard' },
  { id: 'about', label: '關於', icon: 'ℹ️', color: '#6B7280', uri: '/about' },
  { id: 'contact', label: '聯絡', icon: '📞', color: '#EF4444', uri: '/contact' },
];

// 計算按鈕座標（3列 x 2行）
function calculateButtonBounds(index: number): { x: number; y: number; width: number; height: number } {
  const cols = 3;
  const rows = 2;
  const colWidth = Math.floor(RICH_MENU_WIDTH / cols);
  const rowHeight = Math.floor(RICH_MENU_HEIGHT / rows);
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  return {
    x: col * colWidth,
    y: row * rowHeight,
    width: col === cols - 1 ? RICH_MENU_WIDTH - col * colWidth : colWidth, // 最後一列處理餘數
    height: row === rows - 1 ? RICH_MENU_HEIGHT - row * rowHeight : rowHeight, // 最後一行處理餘數
  };
}

// 生成 HTML 內容
function generateHTML(): string {
  const buttons = BUTTON_CONFIG.map((btn, index) => {
    const bounds = calculateButtonBounds(index);
    return {
      ...btn,
      ...bounds,
    };
  });

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rich Menu Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: ${RICH_MENU_WIDTH}px;
      height: ${RICH_MENU_HEIGHT}px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      width: 100%;
      height: 100%;
      gap: 0;
    }
    
    .button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      z-index: 1;
    }
    
    .button-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .button-icon {
      font-size: 120px;
      margin-bottom: 20px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
    
    .button-label {
      font-size: 48px;
      font-weight: bold;
      color: #FFFFFF;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
    }
    
    ${buttons.map((btn, index) => `
    .button-${index} {
      background: ${btn.color};
    }
    `).join('')}
  </style>
</head>
<body>
  <div class="dashboard">
    ${buttons.map((btn, index) => `
      <div class="button button-${index}">
        <div class="button-content">
          <div class="button-icon">${btn.icon}</div>
          <div class="button-label">${btn.label}</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}

// 使用 Puppeteer 生成圖片
async function generateImage(): Promise<string> {
  console.log('🚀 開始生成 Rich Menu 圖片...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    
    // 設定視窗大小
    await page.setViewport({
      width: RICH_MENU_WIDTH,
      height: RICH_MENU_HEIGHT,
    });
    
    // 載入 HTML
    const html = generateHTML();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 截圖
    const outputPath = path.join(process.cwd(), 'rich-menu-dashboard.png');
    await page.screenshot({
      path: outputPath,
      clip: {
        x: 0,
        y: 0,
        width: RICH_MENU_WIDTH,
        height: RICH_MENU_HEIGHT,
      },
    });
    
    console.log(`✅ 圖片已生成：${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

// 建立 Rich Menu 並部署
async function deployRichMenu(imagePath: string, channelAccessToken: string, liffUrl?: string): Promise<void> {
  console.log('🚀 開始部署 Rich Menu 到 LINE...');
  
  const client = new Client({
    channelAccessToken,
  });
  
  // 取得 LIFF URL（優先使用 LIFF_URL，否則使用傳入的參數）
  const baseLiffUrl = process.env.LIFF_URL || liffUrl || '';
  
  // 計算按鈕區域
  const areas = BUTTON_CONFIG.map((btn, index) => {
    const bounds = calculateButtonBounds(index);
    
    // 如果按鈕 URI 是相對路徑，且提供了 LIFF URL，則組合完整 URL
    // 如果按鈕 URI 已經是完整 URL，則直接使用
    let uri = btn.uri;
    if (!uri.startsWith('http') && baseLiffUrl) {
      // 如果是相對路徑，組合 LIFF URL + 路徑
      // 例如：LIFF_URL=https://liff.line.me/2008612222-PgzW5BGy，uri=/editor
      // 結果：https://liff.line.me/2008612222-PgzW5BGy/editor
      const cleanUri = uri.startsWith('/') ? uri : `/${uri}`;
      uri = `${baseLiffUrl}${cleanUri}`;
    } else if (!uri.startsWith('http') && !baseLiffUrl) {
      // 如果沒有提供 LIFF URL，保持相對路徑（前端會處理）
      uri = btn.uri;
    }
    
    return {
      bounds: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      },
      action: {
        type: 'uri' as const,
        uri: uri,
        label: btn.label,
      },
    };
  });
  
  // 建立 Rich Menu
  const richMenu: RichMenu = {
    size: {
      width: RICH_MENU_WIDTH,
      height: RICH_MENU_HEIGHT,
    },
    selected: true,
    name: '土城浪貓主選單',
    chatBarText: '選單',
    areas,
  };
  
  try {
    // 1. 建立 Rich Menu
    console.log('📝 建立 Rich Menu...');
    const richMenuId = await client.createRichMenu(richMenu);
    console.log(`✅ Rich Menu 已建立，ID: ${richMenuId}`);
    
    // 2. 上傳圖片
    console.log('📤 上傳圖片...');
    const imageBuffer = fs.readFileSync(imagePath);
    await client.setRichMenuImage(richMenuId, imageBuffer);
    console.log('✅ 圖片已上傳');
    
    // 3. 設定為預設 Rich Menu
    console.log('⭐ 設定為預設 Rich Menu...');
    await client.setDefaultRichMenu(richMenuId);
    console.log('✅ 已設定為預設 Rich Menu');
    
    console.log('🎉 Rich Menu 部署完成！');
    console.log(`📱 Rich Menu ID: ${richMenuId}`);
  } catch (error) {
    console.error('❌ 部署失敗：', error);
    throw error;
  }
}

// 主函數
async function main() {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  // 優先使用 LIFF_URL，如果沒有則使用 LIFF_BASE_URL 或 VERCEL_PROJECT_PRODUCTION_URL（作為後備）
  const liffUrl = process.env.LIFF_URL || process.env.LIFF_BASE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  
  if (!channelAccessToken) {
    console.error('❌ 錯誤：請設定 LINE_CHANNEL_ACCESS_TOKEN 環境變數');
    process.exit(1);
  }
  
  if (!liffUrl) {
    console.warn('⚠️  警告：未設定 LIFF_URL 環境變數，Rich Menu 按鈕將使用相對路徑');
  } else {
    console.log(`📱 使用 LIFF URL: ${liffUrl}`);
  }
  
  try {
    // 第一步：生成圖片
    const imagePath = await generateImage();
    
    // 第二步：部署到 LINE
    await deployRichMenu(imagePath, channelAccessToken, liffUrl);
    
    console.log('\n✨ 所有步驟完成！');
  } catch (error) {
    console.error('❌ 執行失敗：', error);
    process.exit(1);
  }
}

// 執行
if (require.main === module) {
  main();
}

