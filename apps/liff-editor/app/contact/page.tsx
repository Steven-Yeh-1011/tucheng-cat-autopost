'use client';

import PageHeader from '../components/PageHeader';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader title="聯絡我們" />
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <h3 className="mb-2 font-semibold">Facebook</h3>
            <a
              href="https://www.facebook.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              前往 Facebook 粉絲專頁
            </a>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">LINE</h3>
            <p className="text-slate-600">請透過此官方帳號與我們聯繫</p>
          </div>
        </div>
      </div>
    </div>
  );
}

