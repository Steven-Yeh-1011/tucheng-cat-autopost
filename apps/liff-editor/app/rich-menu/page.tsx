'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';

type RichMenuButton = {
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

type RichMenuConfig = {
  id: string;
  name: string;
  size: {
    width: number;
    height: number;
  };
  buttons: RichMenuButton[];
};

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export default function RichMenuPage() {
  const router = useRouter();
  const [config, setConfig] = useState<RichMenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRichMenuConfig();
  }, []);

  const fetchRichMenuConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!backendBaseUrl) {
        throw new Error('後端服務未設定，請檢查 NEXT_PUBLIC_BACKEND_URL 環境變數');
      }
      
      const response = await fetch(`${backendBaseUrl}/line/rich-menu-config`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`無法載入 Rich Menu 配置：${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      console.error('Failed to fetch rich menu config:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (button: RichMenuButton) => {
    if (button.action.type === 'uri' && button.action.uri) {
      // 如果是相對路徑，使用 Next.js router 進行客戶端路由
      if (button.action.uri.startsWith('/')) {
        router.push(button.action.uri);
      } else {
        // 外部 URL
        window.open(button.action.uri, '_blank');
      }
    } else if (button.action.type === 'postback' && button.action.data) {
      // 處理 postback（可以發送到後端）
      console.log('Postback:', button.action.data);
      // TODO: 發送到後端處理
    } else if (button.action.type === 'message' && button.action.text) {
      // 處理訊息（可以發送到 LINE）
      console.log('Message:', button.action.text);
      // TODO: 發送到 LINE
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl">載入中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-lg text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">無法載入 Rich Menu</h2>
          <div className="mb-6 text-sm text-red-600">{error}</div>
          <div className="mb-4 space-y-2 text-left text-xs text-slate-500">
            <p>請檢查：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>後端服務是否正常運行</li>
              <li>環境變數 NEXT_PUBLIC_BACKEND_URL 是否正確設定</li>
              <li>網路連線是否正常</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              返回主選單
            </button>
            <button
              onClick={fetchRichMenuConfig}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              重試
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  // 計算縮放比例（適應螢幕寬度）
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
  const scale = Math.min(screenWidth / config.size.width, 1);
  const scaledWidth = config.size.width * scale;
  const scaledHeight = config.size.height * scale;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-md px-4 py-8">
        <PageHeader title={config.name} />

        <div
          className="relative mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            maxWidth: '100%',
          }}
        >
          {config.buttons.map((button) => {
            const scaledX = button.position.x * scale;
            const scaledY = button.position.y * scale;
            const scaledWidth = button.position.width * scale;
            const scaledHeight = button.position.height * scale;

            return (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button)}
                className="absolute flex flex-col items-center justify-center border-2 border-white/20 transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  left: `${scaledX}px`,
                  top: `${scaledY}px`,
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  backgroundColor: button.style?.backgroundColor || '#6366F1',
                  color: button.style?.textColor || '#FFFFFF',
                }}
              >
                {button.style?.icon && (
                  <span className="mb-2 text-4xl">{button.style.icon}</span>
                )}
                <span className="text-sm font-semibold">{button.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          點擊按鈕以執行對應功能
        </div>
      </div>
    </div>
  );
}

