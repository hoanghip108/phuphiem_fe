'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import ImageCarousel from '@/components/ImageCarousel';
import { getProducts } from '@/lib/api';
import { useB2Token } from '@/contexts/B2TokenContext';
import type { Product } from '@/types/product';

export default function Home() {
  const { token } = useB2Token();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ page: 1 });
        // Lấy 8 sản phẩm đầu tiên để hiển thị trên trang chủ
        setProducts(res.items.slice(0, 8));
        setError('');
      } catch (err) {
        console.error(err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch products khi đã có token
    if (token !== null) {
      fetchProducts();
    }
  }, [token]);

  // Tạo slides cho carousel với ảnh tĩnh 1.jpg, 2.jpg, 3.jpg
  const carouselSlides = useMemo(
    () => [
      {
        id: 'slide-1',
        image: '/1.jpg',
        title: 'Đồ Handmade Độc Đáo',
        description:
          'Khám phá bộ sưu tập các sản phẩm handmade được làm thủ công với tình yêu và sự tận tâm. Mỗi sản phẩm đều là một tác phẩm nghệ thuật độc nhất.',
        link: '/products',
      },
      {
        id: 'slide-2',
        image: '/2.jpg',
        title: 'Chất Lượng Cao',
        description:
          'Mỗi sản phẩm đều được kiểm tra kỹ lưỡng để đảm bảo chất lượng tốt nhất, mang đến trải nghiệm tuyệt vời cho khách hàng.',
        link: '/products',
      },
      {
        id: 'slide-3',
        image: '/3.jpg',
        title: 'Giao Hàng Nhanh',
        description:
          'Giao hàng toàn quốc với dịch vụ nhanh chóng và đáng tin cậy, đảm bảo sản phẩm đến tay bạn trong thời gian ngắn nhất.',
        link: '/products',
      },
    ],
    []
  );

  // Debug: log carousel slides
  useEffect(() => {
    console.log('Carousel slides:', carouselSlides);
    // Test image loading
    carouselSlides.forEach((slide) => {
      const img = new Image();
      img.onload = () => console.log('✅ Image can be loaded:', slide.image);
      img.onerror = () =>
        console.error('❌ Image cannot be loaded:', slide.image);
      img.src = slide.image;
    });
  }, [carouselSlides]);

  return (
    <div className="bg-white">
      {/* Hero Carousel Section */}
      <section className="relative">
        {carouselSlides.length > 0 ? (
          <ImageCarousel slides={carouselSlides} autoPlayInterval={5000} />
        ) : (
          <div className="h-[500px] flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Đang tải carousel...</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <svg
                  className="h-8 w-8 text-rose-600"
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
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Chất lượng cao
              </h3>
              <p className="text-gray-600">
                Mỗi sản phẩm đều được kiểm tra kỹ lưỡng để đảm bảo chất lượng
                tốt nhất
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <svg
                  className="h-8 w-8 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Làm bằng tình yêu
              </h3>
              <p className="text-gray-600">
                Mỗi sản phẩm được tạo ra với sự tận tâm và tình yêu thủ công
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <svg
                  className="h-8 w-8 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Giao hàng nhanh
              </h3>
              <p className="text-gray-600">
                Giao hàng toàn quốc với dịch vụ nhanh chóng và đáng tin cậy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-4 text-gray-600">
              Những sản phẩm được yêu thích nhất của chúng tôi
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600">{error}</div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/products"
                  className="inline-block rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-rose-700"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-gray-600">
              Chưa có sản phẩm nào
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
