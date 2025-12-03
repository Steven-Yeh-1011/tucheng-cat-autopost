'use client';

import { useRouter } from 'next/navigation';

type PageHeaderProps = {
  title: string;
  showBackButton?: boolean;
  backRoute?: string;
  backLabel?: string;
};

export default function PageHeader({
  title,
  showBackButton = true,
  backRoute = '/dashboard',
  backLabel = '返回主選單',
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {showBackButton && (
        <button
          onClick={() => router.push(backRoute)}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <span>←</span>
          <span>{backLabel}</span>
        </button>
      )}
    </header>
  );
}

