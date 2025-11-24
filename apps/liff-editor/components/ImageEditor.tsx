'use client';

import { useState, useRef, useEffect } from 'react';

interface Image {
  id: string;
  url: string;
  previewUrl: string | null;
}

interface ImageEditorProps {
  image: Image;
  cropData: any;
  onCropChange: (cropData: any) => void;
}

export default function ImageEditor({
  image,
  cropData,
  onCropChange,
}: ImageEditorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load image preview
    const loadImage = async () => {
      try {
        // If preview URL exists, use it; otherwise try to load SVG
        if (image.previewUrl) {
          setImageUrl(image.previewUrl);
        } else if (image.url.endsWith('.svg')) {
          // For SVG, we'll need backend to convert or use a placeholder
          // For now, try to load it directly (may not work in all browsers)
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
          // In production, backend should provide PNG preview
          setImageUrl(image.url);
        } else {
          setImageUrl(image.url);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };

    loadImage();
  }, [image]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsCropping(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCropping || !cropStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (!isCropping || !cropStart || !cropEnd || !containerRef.current) {
      setIsCropping(false);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    if (width > 10 && height > 10) {
      // Normalize coordinates (0-1 range)
      const normalizedCrop = {
        x: x / rect.width,
        y: y / rect.height,
        width: width / rect.width,
        height: height / rect.height,
      };
      onCropChange(normalizedCrop);
    }

    setIsCropping(false);
    setCropStart(null);
    setCropEnd(null);
  };

  const clearCrop = () => {
    onCropChange(null);
  };

  return (
    <div className="rounded-lg border border-gray-300 p-4">
      <div className="mb-2 text-sm font-medium text-gray-700">圖片預覽</div>
      <div
        ref={containerRef}
        className="relative mb-2 cursor-crosshair overflow-hidden rounded border border-gray-200 bg-gray-100"
        style={{ minHeight: '200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="h-full w-full object-contain"
            style={{ maxHeight: '400px' }}
          />
        )}
        {cropData && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
            style={{
              left: `${cropData.x * 100}%`,
              top: `${cropData.y * 100}%`,
              width: `${cropData.width * 100}%`,
              height: `${cropData.height * 100}%`,
            }}
          />
        )}
        {isCropping && cropStart && cropEnd && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
            style={{
              left: `${Math.min(cropStart.x, cropEnd.x)}px`,
              top: `${Math.min(cropStart.y, cropEnd.y)}px`,
              width: `${Math.abs(cropEnd.x - cropStart.x)}px`,
              height: `${Math.abs(cropEnd.y - cropStart.y)}px`,
            }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={clearCrop}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          清除裁切
        </button>
        {cropData && (
          <div className="text-xs text-gray-500">
            已設定裁切區域
          </div>
        )}
      </div>
    </div>
  );
}

