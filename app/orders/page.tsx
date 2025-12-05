'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyOrders, MyOrder } from '@/lib/api';
import B2Image from '@/components/B2Image';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyOrders(accessToken);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải danh sách đơn hàng.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? Number(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      Pending: {
        text: 'Chờ xử lý',
        className: 'bg-yellow-100 text-yellow-800',
      },
      Paid: {
        text: 'Đã thanh toán',
        className: 'bg-green-100 text-green-800',
      },
      Processing: {
        text: 'Đang xử lý',
        className: 'bg-blue-100 text-blue-800',
      },
      Shipped: {
        text: 'Đã giao hàng',
        className: 'bg-purple-100 text-purple-800',
      },
      Delivered: {
        text: 'Đã nhận hàng',
        className: 'bg-gray-100 text-gray-800',
      },
      Cancelled: {
        text: 'Đã hủy',
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const calculateOrderTotal = (order: MyOrder) => {
    return order.orderDetails.reduce(
      (total, detail) =>
        total + Number(detail.unitPrice) * detail.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-16 w-16 animate-spin text-rose-600"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="mt-2 text-gray-600">
            Xem và theo dõi trạng thái đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              Chưa có đơn hàng nào
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Đặt hàng lúc: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-xl font-bold text-rose-600">
                        {formatPrice(calculateOrderTotal(order))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  {order.orderDetails.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Đơn hàng này chưa có chi tiết
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {order.orderDetails.map((detail) => (
                        <div
                          key={detail.id}
                          className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {/* Note: Cần product image từ variant, tạm thời dùng placeholder */}
                            <B2Image
                              fileNamePrefix=""
                              alt="Product"
                              fill
                              className="object-cover"
                              fallback="/placeholder.jpg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Kích thước: {detail.variant.size}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Số lượng: {detail.quantity}
                                </p>
                                {detail.note && (
                                  <p className="mt-1 text-sm text-gray-600 italic">
                                    Ghi chú: {detail.note}
                                  </p>
                                )}
                              </div>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(
                                  Number(detail.unitPrice) * detail.quantity
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

