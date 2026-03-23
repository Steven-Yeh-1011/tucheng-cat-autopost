'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type DashboardItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  bgColor: string;
};

const dashboardItems: DashboardItem[] = [
  {
    id: 'editor',
    title: '貼文編輯器',
    description: '建立和編輯貼文內容',
    icon: '✏️',
    route: '/editor',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
  },
  {
    id: 'drafts',
    title: '查看草稿',
    description: '瀏覽和管理所有草稿',
    icon: '📋',
    route: '/drafts',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
  },
  {
    id: 'generate',
    title: 'AI 生成草稿',
    description: '使用 AI 自動生成貼文內容',
    icon: '✨',
    route: '/generate',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
  },
  {
    id: 'rich-menu',
    title: 'Rich Menu',
    description: '查看圖文選單',
    icon: '📱',
    route: '/rich-menu',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    id: 'about',
    title: '關於我們',
    description: '了解更多資訊',
    icon: 'ℹ️',
    route: '/about',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 hover:bg-slate-100',
  },
  {
    id: 'contact',
    title: '聯絡我們',
    description: '與我們取得聯繫',
    icon: '📞',
    route: '/contact',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 hover:bg-rose-100',
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // 調試信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('=== Dashboard Debug Info ===');
      console.log('User Agent:', navigator.userAgent);
      console.log('Current URL:', window.location.href);
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      console.log('Is in LINE:', 
        navigator.userAgent.includes('Line') || 
        navigator.userAgent.includes('LINE') ||
        window.location.href.includes('liff.line.me')
      );
    }
  }, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">土城浪貓</h1>
          <p className="text-lg text-slate-600">貼文管理系統</p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCardClick(item.route)}
              className={`group relative overflow-hidden rounded-2xl border-2 border-white p-6 text-left shadow-lg transition-all duration-200 ${item.bgColor} hover:scale-105 hover:shadow-xl active:scale-95`}
            >
              {/* Icon */}
              <div className="mb-4 text-5xl transition-transform group-hover:scale-110">
                {item.icon}
              </div>

              {/* Title */}
              <h2 className={`mb-2 text-xl font-bold ${item.color}`}>
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-slate-600">{item.description}</p>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 text-2xl text-slate-400 transition-transform group-hover:translate-x-1">
                →
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            選擇上方功能卡片以開始使用
          </p>
        </div>
      </div>
    </div>
  );
}

