import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Về chúng tôi
            </h3>
            <p className="text-sm">
              Chuyên sản xuất và bán các sản phẩm handmade độc đáo, được làm thủ
              công với tình yêu và sự tận tâm.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=tui-xach"
                  className="hover:text-white transition-colors"
                >
                  Túi xách
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=trang-suc"
                  className="hover:text-white transition-colors"
                >
                  Trang sức
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=phu-kien"
                  className="hover:text-white transition-colors"
                >
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=trang-tri"
                  className="hover:text-white transition-colors"
                >
                  Trang trí
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600/10 text-pink-500">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2.25A6.75 6.75 0 005.25 9v7.5A3.75 3.75 0 009 20.25h6a3.75 3.75 0 003.75-3.75V9A6.75 6.75 0 0012 2.25zm0 3a3.75 3.75 0 013.75 3.75v.75H8.25V9A3.75 3.75 0 0112 5.25z"
                    />
                  </svg>
                </span>
                <a
                  href="https://www.instagram.com/phuphiem.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram: phuphiem.club
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M6.62 10.79a15.053 15.053 0 006.59 6.59l1.98-1.98a1 1 0 011.02-.24c1.12.37 2.33.57 3.59.57a1 1 0 011 1V20a1 1 0 01-1 1C11.4 21 3 12.6 3 2a1 1 0 011-1h2.37a1 1 0 011 1c0 1.26.2 2.47.57 3.59a1 1 0 01-.25 1.02l-1.07 1.07z"
                    />
                  </svg>
                </span>
                <a
                  href="tel:0356999440"
                  className="hover:text-white transition-colors"
                >
                  Hotline: 0356 999 440
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M4 4.75A2.75 2.75 0 016.75 2h10.5A2.75 2.75 0 0120 4.75v14.5A2.75 2.75 0 0117.25 22H6.75A2.75 2.75 0 014 19.25V4.75zm2.75-.25a.75.75 0 00-.75.75v.2l6 3.6 6-3.6v-.2a.75.75 0 00-.75-.75H6.75zm11.5 3.21l-5.55 3.33a.75.75 0 01-.8 0L6.75 7.71V19.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V7.71z"
                    />
                  </svg>
                </span>
                <a
                  href="mailto:phuphiem.club@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Email: phuphiem.club@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2024 Handmade Store. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
