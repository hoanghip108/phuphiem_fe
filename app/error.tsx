'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // eslint-disable-next-line no-console
  console.error(error);

  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg
                className="h-6 w-6"
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
            </div>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Đã có lỗi xảy ra
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Rất tiếc, có lỗi bất ngờ xảy ra khi tải trang. Vui lòng thử lại
              sau.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex w-full justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Thử lại
              </button>
              <Link
                href="/"
                className="inline-flex w-full justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Về trang chủ
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Nếu lỗi tiếp tục xảy ra, hãy liên hệ với quản trị viên.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}


