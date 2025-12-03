'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    const error = searchParams.get('error');
    
    if (id) {
      setOrderId(id);
    }
    
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Thanh toán thất bại
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            {errorMessage ||
              'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'}
          </p>

          {/* Order Information */}
          {orderId && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900">
                    #{orderId}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-2 font-semibold text-red-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Thanh toán thất bại
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Helpful Information */}
          <div className="mb-8 rounded-lg bg-red-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Bạn có thể thử lại
            </h3>
            <ul className="space-y-2 text-left text-gray-700">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Kiểm tra lại số dư tài khoản hoặc thẻ của bạn.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Đảm bảo thông tin thẻ/tài khoản của bạn đã được đăng ký
                  Internet Banking.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Thử lại với phương thức thanh toán khác hoặc liên hệ với
                  chúng tôi để được hỗ trợ.
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Quay lại giỏ hàng
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Cần hỗ trợ?{' '}
              <Link
                href="/contact"
                className="font-semibold text-rose-600 hover:text-rose-700"
              >
                Liên hệ với chúng tôi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}

