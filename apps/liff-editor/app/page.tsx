'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Draft = {
  id: string;
  platform: "META" | "LINE";
  status: string;
  title: string | null;
  content: string;
  mediaUrls: string[];
  scheduledAt: string | null;
  createdAt: string;
  metadata?: {
    source?: string;
    model?: string;
    generatedAt?: string;
    reason?: string;
  } | null;
};

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const metaAuthUrl =
  process.env.NEXT_PUBLIC_META_AUTH_URL ??
  (backendBaseUrl ? `${backendBaseUrl}/meta/callback` : "");
const lineAuthUrl =
  process.env.NEXT_PUBLIC_LINE_AUTH_URL ??
  (backendBaseUrl ? `${backendBaseUrl}/line/webhook` : "");

const emptyDraft = {
  platform: "META" as "META" | "LINE",
  title: "",
  content: "",
  mediaUrls: "",
  scheduledAt: "",
};

export default function LiffEditorPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyDraft);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [metaStatus, setMetaStatus] = useState("尚未連線");
  const [lineStatus, setLineStatus] = useState("尚未連線");

  const backendUnavailable = useMemo(() => !backendBaseUrl, []);

  // 檢測是否在 LINE 環境中，如果是則自動重定向到 Dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 檢查是否在 LINE 環境中（通過 user agent 或 URL 參數）
    const isInLine = 
      window.navigator.userAgent.includes('Line') ||
      window.location.search.includes('liff.state') ||
      window.location.href.includes('liff.line.me') ||
      window.location.href.includes('line.me');
    
    // 如果 URL 中沒有明確指定要顯示編輯器，且在 LINE 環境中，則重定向到 Dashboard
    const showEditor = new URLSearchParams(window.location.search).get('page') === 'editor';
    const currentPath = window.location.pathname;
    const isDashboardOrSpecificPage = 
      currentPath === '/dashboard' || 
      currentPath.startsWith('/editor') ||
      currentPath.startsWith('/drafts') ||
      currentPath.startsWith('/generate') ||
      currentPath.startsWith('/rich-menu') ||
      currentPath.startsWith('/about') ||
      currentPath.startsWith('/contact');
    
    if (isInLine && !showEditor && !isDashboardOrSpecificPage) {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (!backendUnavailable) {
      fetchDrafts();
    }
  }, [backendUnavailable]);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendBaseUrl}/posts/drafts`);
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error(error);
      setMessage("無法取得草稿列表，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const payload = {
        platform: form.platform,
        title: form.title || null,
        content: form.content,
        mediaUrls: form.mediaUrls
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean),
        scheduledAt: form.scheduledAt || null,
      };

      const response = await fetch(`${backendBaseUrl}/posts/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("儲存草稿失敗");
      }

      setForm(emptyDraft);
      setMessage("草稿已儲存");
      await fetchDrafts();
    } catch (error) {
      console.error(error);
      setMessage("儲存草稿失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const response = await fetch(`${backendBaseUrl}/tasks/generate-daily-draft`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("產生草稿失敗");
      }
      const result = await response.json();
      if (result.source === 'google-ai') {
        setMessage("✅ AI 草稿已生成");
      } else {
        setMessage("已觸發自動草稿生成（使用預設內容）");
      }
      await fetchDrafts();
    } catch (error) {
      console.error(error);
      setMessage("自動生成草稿失敗");
    } finally {
      setLoading(false);
    }
  };

  const openOAuthWindow = (url: string, type: "META" | "LINE") => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    if (type === "META") {
      setMetaStatus("已送出授權，等待 Meta 回傳授權碼");
    } else {
      setLineStatus("已送出授權，等待 LINE 回傳授權碼");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase">LIFF Editor</p>
          <h1 className="mt-2 text-3xl font-bold">土城浪貓貼文編輯器</h1>
          <p className="mt-2 text-sm text-slate-500">
            連結 Meta / LINE 授權，並在同一個畫面管理每日草稿、排程與自動生成。
          </p>
          <div className="mt-4">
            <a
              href="/rich-menu"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <span>📱</span>
              <span>查看 Rich Menu</span>
            </a>
          </div>
          {backendUnavailable && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              尚未設定 NEXT_PUBLIC_BACKEND_URL，無法與後端溝通。
            </p>
          )}
          {message && (
            <p className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {message}
            </p>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <OAuthCard
            title="Meta 授權"
            description="連結粉專後可同步草稿、排程與貼文發佈。"
            status={metaStatus}
            actionLabel="前往 Meta 授權"
            onClick={() => openOAuthWindow(metaAuthUrl, "META")}
            disabled={!metaAuthUrl}
          />
          <OAuthCard
            title="LINE 授權"
            description="綁定官方帳號以同步 LIFF 表單資料、貼文草稿。"
            status={lineStatus}
            actionLabel="前往 LINE 授權"
            onClick={() => openOAuthWindow(lineAuthUrl, "LINE")}
            disabled={!lineAuthUrl}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <form
            onSubmit={handleSubmitDraft}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">草稿編輯器</h2>
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={loading || backendUnavailable}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                自動生成草稿
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                發佈平台
                <select
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.platform}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, platform: event.target.value as "META" | "LINE" }))
                  }
                >
                  <option value="META">Meta 粉專</option>
                  <option value="LINE">LINE 官方帳號</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                標題
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="例如：今日待送養的浪貓"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                內容
                <textarea
                  value={form.content}
                  onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                  placeholder="輸入貼文內容，支援多段文字"
                  className="min-h-[160px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                圖片網址（一行一張）
                <textarea
                  value={form.mediaUrls}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, mediaUrls: event.target.value }))
                  }
                  placeholder="https://example.com/cat-1.jpg"
                  className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                預計發佈時間（選填）
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, scheduledAt: event.target.value }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="reset"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => setForm(emptyDraft)}
              >
                清除
              </button>
              <button
                type="submit"
                disabled={loading || backendUnavailable || !form.content}
                className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                儲存草稿
              </button>
            </div>
          </form>

          <aside className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">即時預覽</h3>
            <p className="mt-1 text-xs text-slate-500">
              依照目標平台即時渲染文字
            </p>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-400">{form.platform}</p>
              <p className="mt-2 text-base font-semibold">{form.title || "（尚未輸入標題）"}</p>
              <p className="mt-3 whitespace-pre-wrap">{form.content || "請輸入內容以預覽"}</p>
              {form.mediaUrls && (
                <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-500">
                  {form.mediaUrls
                    .split("\n")
                    .filter(Boolean)
                    .map((url) => (
                      <li key={url} className="break-all">
                        {url}
                      </li>
                    ))}
                </ul>
              )}
              {form.scheduledAt && (
                <p className="mt-3 text-xs text-slate-500">
                  預計發佈：{new Date(form.scheduledAt).toLocaleString()}
                </p>
              )}
            </div>
          </aside>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">草稿列表</h2>
            <button
              type="button"
              onClick={fetchDrafts}
              disabled={loading || backendUnavailable}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              重新整理
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">平台</th>
                  <th className="px-4 py-3">標題 / 內容</th>
                  <th className="px-4 py-3">狀態</th>
                  <th className="px-4 py-3">建立時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {drafts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      {backendUnavailable ? "尚未設定後端網址" : "目前沒有草稿"}
                    </td>
                  </tr>
                )}
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td className="px-4 py-3 font-semibold">{draft.platform}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{draft.title || "（無標題）"}</p>
                          <p className="line-clamp-2 text-xs text-slate-500">{draft.content}</p>
                        </div>
                        {(draft.metadata?.source === 'google-ai' || draft.metadata?.source === 'openai') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700">
                            <span>🤖</span>
                            <span>AI</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={draft.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(draft.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

type OAuthCardProps = {
  title: string;
  description: string;
  status: string;
  actionLabel: string;
  onClick: () => void;
  disabled?: boolean;
};

function OAuthCard({
  title,
  description,
  status,
  actionLabel,
  onClick,
  disabled,
}: OAuthCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500 uppercase">{title}</p>
      <p className="mt-2 text-base text-slate-700">{description}</p>
      <p className="mt-4 rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-600">{status}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mt-4 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "PUBLISHED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "SCHEDULED"
      ? "bg-amber-50 text-amber-700"
      : status === "FAILED"
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
