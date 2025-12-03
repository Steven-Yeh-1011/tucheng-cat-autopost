'use client';

import PageHeader from '../components/PageHeader';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader title="貼文編輯器" />
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-slate-600">這裡是編輯器頁面</p>
          {/* 可以整合現有的編輯器功能 */}
        </div>
      </div>
    </div>
  );
}

