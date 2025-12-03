'use client';

import { useEffect, useState } from 'react';

type Draft = {
  id: string;
  platform: 'META' | 'LINE';
  status: string;
  title: string | null;
  content: string;
  createdAt: string;
};

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendBaseUrl}/posts/drafts`);
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">草稿列表</h1>
        {drafts.length === 0 ? (
          <p className="text-slate-600">目前沒有草稿</p>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    {draft.platform}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">
                  {draft.title || '（無標題）'}
                </h3>
                <p className="line-clamp-3 text-sm text-slate-600">
                  {draft.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

