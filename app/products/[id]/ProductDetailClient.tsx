'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BackendProduct, BackendProductVariant } from '@/lib/api';
import { useCart } from '@/components/CartContext';

interface ProductDetailClientProps {
  product: BackendProduct;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants[0]?.id ?? null
  );

  const selectedVariant: BackendProductVariant | undefined = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId),
    [product.variants, selectedVariantId]
  );

  const priceNumber = selectedVariant
    ? Number(selectedVariant.price)
    : product.variants[0]
    ? Number(product.variants[0].price)
    : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const inStock = product.variants.length > 0;

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!inStock) return;
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;

    addItem({
      productId: product.id,
      productName: product.productName,
      image: product.images[0] || '/placeholder.jpg',
      variantId: variant.id,
      size: variant.size,
      price: Number(variant.price),
      quantity: 1,
    });
  };

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-rose-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-rose-600">
                Sản phẩm
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.productName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.productName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={img}
                      alt={`${product.productName} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600">
                {product.productCategory?.categoryName ?? 'Sản phẩm'}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {product.productName}
            </h1>

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="variant"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Chọn kích thước
                </label>
                <div className="relative inline-block w-full max-w-xs">
                  <select
                    id="variant"
                    value={selectedVariantId ?? undefined}
                    onChange={(e) =>
                      setSelectedVariantId(Number(e.target.value))
                    }
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.size} – {formatPrice(Number(variant.price))}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className="text-3xl font-bold text-rose-600">
                {formatPrice(priceNumber)}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <span className="flex items-center text-green-600">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Còn hàng
                </span>
              ) : (
                <span className="text-red-600">Hết hàng</span>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className={`w-full rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all ${
                  inStock
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'cursor-not-allowed bg-gray-400'
                }`}
              >
                {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
              <button className="w-full rounded-lg border-2 border-rose-600 px-6 py-3 text-lg font-semibold text-rose-600 transition-all hover:bg-rose-50">
                Yêu thích
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-4 border-t border-gray-200 pt-8">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Thông tin sản phẩm
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Sản phẩm handmade độc đáo</li>
                  <li>• Chất liệu tự nhiên, thân thiện môi trường</li>
                  <li>• Được làm thủ công với sự tận tâm</li>
                  <li>• Giao hàng toàn quốc</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


