import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// 載入環境變數（從專案根目錄）
// 專案根目錄位於 apps/backend 的上兩層
const projectRoot = path.resolve(__dirname, '../../..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const RICH_MENU_WIDTH = 2500;
const RICH_MENU_HEIGHT = 1686;

const BUTTON_CONFIG = [
  { id: 'editor', label: '編輯器', icon: '✏️', color: '#4F46E5', uri: '/editor' },
  { id: 'view-drafts', label: '查看草稿', icon: '📋', color: '#10B981', uri: '/drafts' },
  { id: 'generate-draft', label: '生成草稿', icon: '✨', color: '#F59E0B', uri: '/generate' },
  { id: 'dashboard', label: '主選單', icon: '🏠', color: '#1877F2', uri: '/dashboard' },
  { id: 'about', label: '關於', icon: 'ℹ️', color: '#6B7280', uri: '/about' },
  { id: 'contact', label: '聯絡', icon: '📞', color: '#EF4444', uri: '/contact' },
];

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
    width: col === cols - 1 ? RICH_MENU_WIDTH - col * colWidth : colWidth,
    height: row === rows - 1 ? RICH_MENU_HEIGHT - row * rowHeight : rowHeight,
  };
}

function generateHTML(): string {
  const buttons = BUTTON_CONFIG.map((btn, index) => {
    const bounds = calculateButtonBounds(index);
    return {
      ...btn,
      ...bounds,
    };
  });

  const liffUrl = process.env.LIFF_URL || 'https://liff.line.me/2008612222-PgzW5BGy';

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
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
      background: rgba(255, 255, 255, 0.95);
      border: 3px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }
    .button:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.02);
    }
    .icon {
      font-size: 120px;
      margin-bottom: 20px;
    }
    .label {
      font-size: 56px;
      font-weight: bold;
      color: #1f2937;
      text-align: center;
    }
    ${buttons.map((btn, i) => `
    .button-${i} {
      background: ${btn.color}15;
      border-color: ${btn.color}40;
    }
    .button-${i} .label {
      color: ${btn.color};
    }
    `).join('')}
  </style>
</head>
<body>
  <div class="container">
    ${buttons.map((btn, i) => `
    <div class="button button-${i}">
      <div class="icon">${btn.icon}</div>
      <div class="label">${btn.label}</div>
    </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}

async function generateImage(): Promise<string> {
  console.log('🎨 開始生成 Rich Menu 圖片...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: RICH_MENU_WIDTH,
      height: RICH_MENU_HEIGHT,
    });
    
    const html = generateHTML();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const outputPath = path.join(process.cwd(), 'rich-menu-dashboard.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });
    
    console.log(`✅ 圖片已生成: ${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    await generateImage();
    console.log('\n✨ 圖片生成完成！');
  } catch (error) {
    console.error('❌ 生成失敗：', error);
    process.exit(1);
  }
}

main();

