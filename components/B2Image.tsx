'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getB2ImageUrl } from '@/lib/api';

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
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileNamePrefix) {
      setImageUrl(fallback);
      setLoading(false);
      return;
    }

    // Check if fileNamePrefix is already a full URL (starts with http)
    if (fileNamePrefix.startsWith('http')) {
      setImageUrl(fileNamePrefix);
      setLoading(false);
      return;
    }

    // Convert fileNamePrefix to full B2 URL
    getB2ImageUrl(fileNamePrefix)
      .then((url) => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setImageUrl(fallback);
        setLoading(false);
      });
  }, [fileNamePrefix, fallback]);

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

