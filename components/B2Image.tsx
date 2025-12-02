'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useB2Token } from '@/contexts/B2TokenContext';
import { buildB2ImageUrl } from '@/lib/api';

interface B2ImageProps {
  fileNamePrefix: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: string;
}

/**
 * Component tự động convert Backblaze B2 fileNamePrefix thành full URL với authorization
 */
export default function B2Image({
  fileNamePrefix,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  fallback = '/placeholder.jpg',
}: B2ImageProps) {
  const { token, loading: tokenLoading } = useB2Token();
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);

    if (!fileNamePrefix) {
      setImageUrl(fallback);
      return;
    }

    // Check if fileNamePrefix is already a full URL (starts with http)
    if (fileNamePrefix.startsWith('http')) {
      setImageUrl(fileNamePrefix);
      return;
    }

    // Build URL từ token (không cần call API nữa)
    if (token) {
      const url = buildB2ImageUrl(fileNamePrefix, token);
      setImageUrl(url);
    } else if (!tokenLoading) {
      // Token đã load xong nhưng không có token (error)
      setImageUrl(fallback);
    }
  }, [fileNamePrefix, token, tokenLoading, fallback]);

  const loading = tokenLoading || !token;

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div
      className={`absolute inset-0 animate-pulse bg-gray-200 ${
        fill ? '' : 'rounded'
      }`}
    >
      <div className="flex h-full items-center justify-center">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );

  if (fill) {
    return (
      <>
        {loading && <SkeletonLoader />}
        {!loading && (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className={`${className || ''} transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes={sizes}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative">
      {loading && <SkeletonLoader />}
      {!loading && (
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={`${className || ''} transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          priority={priority}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
}
