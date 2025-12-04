'use client';

import { UserDetail } from '@/lib/api';

interface PaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fullName: string;
  email: string;
  activeDetail: UserDetail | null;
  totalAmount: number;
  isLoading?: boolean;
}

export default function PaymentConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  fullName,
  email,
  activeDetail,
  totalAmount,
  isLoading = false,
}: PaymentConfirmModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatAddress = () => {
    if (!activeDetail) return 'Chưa có địa chỉ';
    const parts = [
      activeDetail.address,
      activeDetail.ward,
      activeDetail.district,
      activeDetail.province,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Chưa có địa chỉ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Xác nhận thông tin thanh toán
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng kiểm tra thông tin trước khi thanh toán
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Thông tin cá nhân */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Thông tin cá nhân
              </h3>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Họ và tên:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {fullName || 'Chưa có thông tin'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {email || 'Chưa có thông tin'}
                  </span>
                </div>
                {activeDetail?.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {activeDetail.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Địa chỉ giao hàng
              </h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-900">{formatAddress()}</p>
                {!activeDetail && (
                  <p className="mt-2 text-xs text-amber-600">
                    ⚠️ Bạn chưa có địa chỉ giao hàng. Vui lòng cập nhật địa chỉ
                    trong{' '}
                    <a
                      href="/profile"
                      className="font-semibold underline"
                      onClick={onClose}
                    >
                      trang cá nhân
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Tổng thanh toán:</span>
                <span className="text-rose-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !activeDetail}
            className="rounded-lg bg-rose-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
}

