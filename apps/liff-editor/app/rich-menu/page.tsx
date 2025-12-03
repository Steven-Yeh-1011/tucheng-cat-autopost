'use client';

import { useEffect, useState } from 'react';

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
  const [config, setConfig] = useState<RichMenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRichMenuConfig();
  }, []);

  const fetchRichMenuConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendBaseUrl}/line/rich-menu-config`);
      if (!response.ok) {
        throw new Error('Failed to fetch rich menu config');
      }
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (button: RichMenuButton) => {
    if (button.action.type === 'uri' && button.action.uri) {
      // 如果是相對路徑，使用 Next.js router
      if (button.action.uri.startsWith('/')) {
        window.location.href = button.action.uri;
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">錯誤：{error}</div>
          <button
            onClick={fetchRichMenuConfig}
            className="rounded bg-indigo-600 px-4 py-2 text-white"
          >
            重試
          </button>
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
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{config.name}</h1>
        </header>

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

