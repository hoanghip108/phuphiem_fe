'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({
          page,
          search: searchQuery || undefined,
        });
        setProducts(res.items);
        setTotal(res.total);
        if (res.page && res.page !== page) {
          setPage(res.page);
        }
        setError('');
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchQuery]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Tất cả', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [products, selectedCategory]);

  const totalPages = useMemo(
    () => (total > 0 ? Math.max(1, Math.ceil(total / 20)) : 1),
    [total]
  );

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
          <p className="mt-2 text-gray-600">
            Khám phá bộ sưu tập đầy đủ các sản phẩm handmade của chúng tôi
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
          {/* Search */}
          <div className="flex-1 md:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-black placeholder:text-black focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results / Loading / Error */}
        {loading ? (
          <div className="py-12 text-center text-gray-600">
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Tìm thấy {total} sản phẩm
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600">
                  Không tìm thấy sản phẩm nào. Hãy thử tìm kiếm với từ khóa
                  khác.
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-full border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {page}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                disabled={page >= totalPages}
                className="rounded-full border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Trang sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
