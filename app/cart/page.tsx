'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { createVnpayPayment } from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const {
    items: cartItems,
    totalAmount,
    removeItem,
    clearCart,
    updateQuantity,
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống');
      return;
    }

    // Kiểm tra đăng nhập
    if (typeof window === 'undefined') return;
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Vui lòng đăng nhập để thanh toán');
      router.push('/login');
      return;
    }

    // Kiểm tra variantId có đầy đủ không
    const itemsWithoutVariant = cartItems.filter(
      (item) => !item.variantId
    );
    if (itemsWithoutVariant.length > 0) {
      setError(
        'Một số sản phẩm chưa có thông tin biến thể. Vui lòng kiểm tra lại.'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Map cartItems sang format productVariants
      const productVariants = cartItems.map((item) => ({
        variantId: item.variantId!,
        quantity: item.quantity,
      }));

      // Gọi API tạo thanh toán VNPay
      const response = await createVnpayPayment(
        {
          bankCode: 'NCB',
          locale: 'vn',
          productVariants,
          note: 'Đơn hàng từ website',
        },
        accessToken
      );

      // Nếu có paymentUrl, redirect đến trang thanh toán VNPay
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        // Nếu không có paymentUrl, có thể redirect đến trang success với orderId
        const orderId = response.orderId || '';
        router.push(
          `/payment/success?orderId=${orderId}&amount=${totalAmount}`
        );
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
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
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              Giỏ hàng trống
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Kích thước: {item.size}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-rose-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Xóa
                      </button>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-md border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (Number.isNaN(value)) return;
                              updateQuantity(item.id, value);
                            }}
                            className="w-12 border-l border-r border-gray-300 py-1 text-center text-sm text-black outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={clearCart}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Tóm tắt đơn hàng
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || cartItems.length === 0}
                  className="mt-6 w-full rounded-lg bg-rose-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
