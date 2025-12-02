import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Trang không tìm thấy
        </h2>
        <p className="mb-8 text-gray-600">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-rose-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
