'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import liff from '@line/liff';
import EditorContent from '@/components/EditorContent';

interface Post {
  id: string;
  title: string | null;
  body: string;
  type: 'CAT' | 'LIFE';
  status: 'DRAFT' | 'PUBLISHED';
  images: Array<{
    id: string;
    position: number;
    cropData: any;
    image: {
      id: string;
      url: string;
      previewUrl: string | null;
    };
  }>;
}

export default function EditorPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize LIFF
    const initLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          console.warn('LIFF ID not set, running in development mode');
          setLiffInitialized(true);
          return;
        }

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        setLiffInitialized(true);
      } catch (err) {
        console.error('LIFF initialization error:', err);
        setError('無法初始化 LINE LIFF');
      }
    };

    initLiff();
  }, []);

  useEffect(() => {
    // Fetch post data
    if (liffInitialized || !process.env.NEXT_PUBLIC_LIFF_ID) {
      const fetchPost = async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
          const response = await fetch(`${backendUrl}/api/posts/${postId}`);
          if (!response.ok) {
            throw new Error('無法載入草稿');
          }
          const data = await response.json();
          setPost(data);
        } catch (err) {
          console.error('Failed to fetch post:', err);
          setError('無法載入草稿');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [postId, liffInitialized]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">載入中...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg text-red-600">{error || '找不到草稿'}</div>
        </div>
      </div>
    );
  }

  return <EditorContent post={post} onPostUpdate={setPost} />;
}

