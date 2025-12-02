import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 驗證必要的環境變數
 * 確保後端連接到正確的資料庫與服務
 */
function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'DATABASE_URL', // Prisma 連線字串
  ];

  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ 缺少必要的環境變數:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n請確認以下位置已設定正確的環境變數:');
    console.error('  - 本地開發: .env 檔案');
    console.error('  - Render: Dashboard → Environment Variables');
    console.error('  - Vercel: Dashboard → Settings → Environment Variables');
    process.exit(1);
  }

  // 驗證 DATABASE_URL 格式（PostgreSQL）
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.error('❌ DATABASE_URL 格式錯誤，應為 postgresql:// 或 postgres:// 開頭');
      process.exit(1);
    }
  }

  console.log('✅ 環境變數驗證通過');
}

async function bootstrap() {
  // 啟動前驗證環境變數
  validateEnvironmentVariables();

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 後端服務已啟動於 http://localhost:${port}`);
}
bootstrap();
