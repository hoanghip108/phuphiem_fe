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
  const [mounted, setMounted] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

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
        // Validate data structure
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error('Dữ liệu đơn hàng không hợp lệ');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải danh sách đơn hàng.'
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, mounted]);

  const formatPrice = (price: string | number) => {
    try {
      const numPrice = typeof price === 'string' ? Number(price) : price;
      if (isNaN(numPrice)) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(numPrice);
    } catch {
      return '0 ₫';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';

      const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${timeFormatter.format(date)} ${dateFormatter.format(date)}`;
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      Pending: {
        text: 'Chờ thanh toán',
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
    if (!order.orderDetails || order.orderDetails.length === 0) {
      return 0;
    }
    return order.orderDetails.reduce(
      (total, detail) =>
        total + Number(detail.unitPrice || 0) * (detail.quantity || 0),
      0
    );
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const isOrderExpanded = (orderId: number) => {
    return expandedOrders.has(orderId);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn hàng của tôi
            </h1>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi khi tải đơn hàng
                </h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    const accessToken = localStorage.getItem('accessToken');
                    if (accessToken) {
                      setError(null);
                      setLoading(true);
                      getMyOrders(accessToken)
                        .then(setOrders)
                        .catch((err) => {
                          setError(
                            err instanceof Error
                              ? err.message
                              : 'Không thể tải danh sách đơn hàng.'
                          );
                        })
                        .finally(() => setLoading(false));
                    }
                  }}
                  className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="mt-2 text-gray-600">
            Xem và theo dõi trạng thái đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
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
          </div>
        ) : (
          <div className="space-y-6 pb-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderCode || `#${order.id}`}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Thời gian đặt: {formatDate(order.createdAt)}
                          </span>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-start gap-1 text-xs">
                            <svg
                              className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-gray-700 break-words">
                              <span className="font-medium">
                                Địa chỉ giao hàng:
                              </span>{' '}
                              {order.shippingAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right sm:text-left sm:min-w-[150px]">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Tổng tiền
                        </p>
                        <p className="mt-1 text-2xl font-bold text-rose-600">
                          {formatPrice(calculateOrderTotal(order))}
                        </p>
                        {order.orderDetails &&
                          order.orderDetails.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                              {order.orderDetails.length} sản phẩm
                            </p>
                          )}
                      </div>
                      {order.orderDetails && order.orderDetails.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleOrderDetails(order.id)}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          aria-expanded={isOrderExpanded(order.id)}
                        >
                          <span className="text-xs">
                            {isOrderExpanded(order.id) ? 'Ẩn' : 'Xem'} chi tiết
                          </span>
                          <svg
                            className={`h-5 w-5 text-gray-500 transition-transform ${
                              isOrderExpanded(order.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {order.orderDetails && order.orderDetails.length > 0 && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOrderExpanded(order.id)
                        ? 'max-h-[5000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                    style={{
                      minHeight: isOrderExpanded(order.id) ? 'auto' : '0',
                    }}
                  >
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200">
                          <div className="col-span-6">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Sản phẩm
                            </h4>
                          </div>
                          <div className="col-span-2 text-right">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Đơn giá
                            </h4>
                          </div>
                          <div className="col-span-2 text-right">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Số lượng
                            </h4>
                          </div>
                          <div className="col-span-2 text-right">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Thành tiền
                            </h4>
                          </div>
                        </div>

                        {order.orderDetails.map((detail) => {
                          const product = detail.variant?.product;
                          const productImage = product?.images?.[0] || '';
                          const productName =
                            product?.productName || 'Sản phẩm';

                          return (
                            <div
                              key={detail.id}
                              className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-0"
                            >
                              {/* Product Info + Image */}
                              <div className="col-span-6 flex items-center gap-3">
                                {productImage && (
                                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                                    <B2Image
                                      fileNamePrefix={productImage}
                                      alt={productName}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                      fallback="/placeholder.jpg"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  {productName && (
                                    <h5 className="font-semibold text-gray-900 mb-1">
                                      {productName}
                                    </h5>
                                  )}
                                  <div className="text-sm text-gray-600">
                                    {detail.variant?.size && (
                                      <span>{detail.variant.size}</span>
                                    )}
                                  </div>
                                  {detail.note && (
                                    <div className="mt-1 text-xs text-blue-600">
                                      Ghi chú: {detail.note}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Unit Price */}
                              <div className="col-span-2 text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatPrice(detail.unitPrice || '0')}
                                </p>
                              </div>

                              {/* Quantity */}
                              <div className="col-span-2 text-right">
                                <p className="font-semibold text-gray-900">
                                  {detail.quantity || 0}
                                </p>
                              </div>

                              {/* Total */}
                              <div className="col-span-2 text-right">
                                <p className="text-lg font-bold text-rose-600">
                                  {formatPrice(
                                    Number(detail.unitPrice || 0) *
                                      (detail.quantity || 0)
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {(!order.orderDetails || order.orderDetails.length === 0) && (
                  <div className="px-6 py-4">
                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-2 text-sm text-gray-500">
                        Đơn hàng này chưa có chi tiết sản phẩm
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
