'use client';

import { useState } from 'react';

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${backendBaseUrl}/tasks/generate-daily-draft`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('生成失敗');
      }
      const result = await response.json();
      if (result.source === 'google-ai') {
        setMessage('✅ AI 草稿已生成');
      } else {
        setMessage('已觸發自動草稿生成（使用預設內容）');
      }
    } catch (error) {
      setMessage('生成草稿失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">生成草稿</h1>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="mb-4 text-slate-600">
            點擊下方按鈕，系統將使用 AI 自動生成今日的貼文草稿。
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? '生成中...' : '生成草稿'}
          </button>
          {message && (
            <p className="mt-4 text-sm text-emerald-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

