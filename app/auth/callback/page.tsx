'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCartItems, type BackendCartItem } from '@/lib/api';
import { useCart } from '@/components/CartContext';
import type { CartItem } from '@/types/product';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrateItems } = useCart();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );
  const [error, setError] = useState<string | null>(null);

  // Map backend cart item to cart item
  const mapBackendCartItemToCartItem = (backendItem: BackendCartItem): CartItem => {
    const product = backendItem.variant.product;
    const priceNumber = Number(backendItem.variant.price);
    const productId = product?.id ?? backendItem.variant.id;
    const variantId = backendItem.variant.id;
    const lineId = `${productId}-${variantId ?? 'default'}`;

    return {
      id: lineId,
      productId,
      productName: product?.productName ?? 'Sản phẩm',
      image: product?.images?.[0] ?? '',
      variantId,
      size: backendItem.variant.size,
      price: Number.isNaN(priceNumber) ? 0 : priceNumber,
      quantity: backendItem.quantity,
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = searchParams.get('token') || searchParams.get('accessToken');
    const userParam = searchParams.get('user');

    if (!token) {
      setError('Không tìm thấy token đăng nhập.');
      setStatus('error');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    const processAuth = async () => {
      try {
        // Lưu accessToken vào localStorage
        localStorage.setItem('accessToken', token);

        // Parse và lưu user info nếu có
        if (userParam) {
          try {
            // Decode URL encoded string
            const decodedUser = decodeURIComponent(userParam);
            const user = JSON.parse(decodedUser);
            if (user && typeof user === 'object') {
              localStorage.setItem('user', JSON.stringify(user));
            }
          } catch (parseErr) {
            console.error('Failed to parse user from query params:', parseErr);
            // Vẫn tiếp tục dù parse user fail
          }
        }

        // Trigger custom event để Header biết cần refresh
        window.dispatchEvent(new Event('auth-update'));

        // Hydrate cart ngay sau khi đăng nhập (nếu backend có dữ liệu)
        try {
          const serverItems = await getCartItems(token);
          const mapped = serverItems.map(mapBackendCartItemToCartItem);
          if (mapped.length > 0) {
            hydrateItems(mapped);
          }
        } catch (cartErr) {
          console.error('Failed to hydrate cart after OAuth login:', cartErr);
          // Không block flow nếu hydrate cart fail
        }

        setStatus('success');

        // Redirect về homepage sau 500ms để đảm bảo localStorage đã được set
        setTimeout(() => {
          router.push('/');
        }, 500);
      } catch (err) {
        console.error('Error processing OAuth callback:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Có lỗi xảy ra khi xử lý đăng nhập.'
        );
        setStatus('error');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };

    processAuth();
  }, [searchParams, router, hydrateItems]);

  if (status === 'processing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-rose-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">
            Đăng nhập thất bại
          </p>
          <p className="mt-2 text-gray-600">{error || 'Có lỗi xảy ra'}</p>
          <p className="mt-4 text-sm text-gray-500">
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          Đăng nhập thành công!
        </p>
        <p className="mt-2 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

