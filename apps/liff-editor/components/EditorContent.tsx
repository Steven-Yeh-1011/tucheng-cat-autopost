'use client';

import { useState } from 'react';
import ImageEditor from './ImageEditor';

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

interface EditorContentProps {
  post: Post;
  onPostUpdate: (post: Post) => void;
}

export default function EditorContent({ post, onPostUpdate }: EditorContentProps) {
  const [title, setTitle] = useState(post.title || '');
  const [body, setBody] = useState(post.body);
  const [images, setImages] = useState(post.images);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || null,
          body,
          images: images.map((img) => ({
            imageId: img.image.id,
            position: img.position,
            cropData: img.cropData,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('儲存失敗');
      }

      const updatedPost = await response.json();
      onPostUpdate(updatedPost);
      setMessage('已儲存');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage('儲存失敗，請重試');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('確定要發佈這篇貼文嗎？')) {
      return;
    }

    setPublishing(true);
    setMessage(null);

    try {
      // Save first
      await handleSave();

      // Then publish
      const response = await fetch(`${backendUrl}/api/posts/${post.id}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('發佈失敗');
      }

      const result = await response.json();
      setMessage('發佈成功！');
      
      // Update post status
      onPostUpdate({
        ...post,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Publish error:', error);
      setMessage('發佈失敗，請重試');
    } finally {
      setPublishing(false);
    }
  };

  const handleImageCrop = (imageId: string, cropData: any) => {
    setImages((prev) =>
      prev.map((img) =>
        img.image.id === imageId
          ? { ...img, cropData }
          : img
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">編輯草稿</h1>

          {/* Title Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              標題（選填）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="輸入標題..."
            />
          </div>

          {/* Body Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              內文
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="輸入內文..."
            />
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              圖片
            </label>
            <div className="space-y-4">
              {images.map((postImage) => (
                <ImageEditor
                  key={postImage.id}
                  image={postImage.image}
                  cropData={postImage.cropData}
                  onCropChange={(cropData) =>
                    handleImageCrop(postImage.image.id, cropData)
                  }
                />
              ))}
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-4 rounded-md p-3 ${
                message.includes('成功')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving || publishing}
              className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? '儲存中...' : '儲存'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || publishing || post.status === 'PUBLISHED'}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {publishing ? '發佈中...' : '發佈'}
            </button>
          </div>

          {post.status === 'PUBLISHED' && (
            <div className="mt-4 text-sm text-green-600">
              ✓ 此貼文已發佈
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

