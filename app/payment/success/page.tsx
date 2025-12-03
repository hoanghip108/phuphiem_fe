'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ query params hoặc localStorage
    const id = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    
    if (id) {
      setOrderId(id);
    }
    
    if (amount) {
      setTotalAmount(parseFloat(amount));
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-12 w-12 text-emerald-600"
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
          </div>

          {/* Success Message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Thanh toán thành công!
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn
            đã được xử lý thành công.
          </p>

          {/* Order Information Card */}
          {(orderId || totalAmount) && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-3">
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-900">
                      #{orderId}
                    </span>
                  </div>
                )}
                {totalAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-lg font-bold text-rose-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-600">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Đã thanh toán
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8 rounded-lg bg-rose-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Bước tiếp theo
            </h3>
            <ul className="space-y-2 text-left text-gray-700">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600"
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
                  Chúng tôi sẽ gửi email xác nhận đơn hàng đến địa chỉ email
                  của bạn trong vài phút tới.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600"
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
                  Đơn hàng của bạn sẽ được xử lý và giao hàng trong vòng 3-5
                  ngày làm việc.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600"
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
                  Bạn có thể theo dõi trạng thái đơn hàng trong phần "Đơn hàng
                  của tôi".
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/orders"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Xem đơn hàng của tôi
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Có câu hỏi về đơn hàng?{' '}
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

