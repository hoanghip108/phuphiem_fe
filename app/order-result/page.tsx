'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

export const dynamic = 'force-dynamic';

function VnpayReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    const orderId = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');

    const isSuccess = responseCode === '00' && transactionStatus === '00';

    if (isSuccess) {
      const amountInVND = amount ? parseInt(amount) / 100 : 0;
      router.replace(`/payment/success?orderId=${orderId || ''}&amount=${amountInVND}`);
    } else {
      let errorMessage = 'Thanh toán thất bại.';
      if (responseCode === '07') {
        errorMessage = 'Trừ tiền thành công. Giao dịch bị nghi ngờ.';
      } else if (responseCode === '09') {
        errorMessage = 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.';
      } else if (responseCode === '10') {
        errorMessage = 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.';
      } else if (responseCode === '11') {
        errorMessage = 'Đã hết hạn chờ thanh toán. Vui lòng thử lại.';
      } else if (responseCode === '12') {
        errorMessage = 'Thẻ/Tài khoản bị khóa.';
      } else if (responseCode === '51') {
        errorMessage = 'Tài khoản không đủ số dư để thực hiện giao dịch.';
      } else if (responseCode === '65') {
        errorMessage = 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.';
      } else if (responseCode === '75') {
        errorMessage = 'Ngân hàng thanh toán đang bảo trì.';
      } else if (responseCode === '79') {
        errorMessage = 'Nhập sai mật khẩu thanh toán quá số lần quy định.';
      }
      setStatus('error');
      setMessage(errorMessage);
      setTimeout(() => {
        router.replace(`/payment/failure?orderId=${orderId || ''}&error=${encodeURIComponent(errorMessage)}`);
      }, 3000);
    }
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Thanh toán thất bại</h1>
        <p className="mb-4 text-gray-600">{message}</p>
        <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

export default function VnpayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600"></div>
            <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
          </div>
        </div>
      }
    >
      <VnpayReturnContent />
    </Suspense>
  );
}
