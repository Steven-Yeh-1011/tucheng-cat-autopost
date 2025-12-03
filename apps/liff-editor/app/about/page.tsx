'use client';

import PageHeader from '../components/PageHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader title="關於土城浪貓" />
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            我們是一群關心流浪貓的志工，致力於為土城地區的流浪貓提供幫助。
          </p>
          <p className="text-slate-700">
            透過這個平台，我們可以更有效地管理貼文、分享資訊，並與社區保持聯繫。
          </p>
        </div>
      </div>
    </div>
  );
}

