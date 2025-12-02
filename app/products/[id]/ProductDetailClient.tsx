'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BackendProduct, BackendProductVariant } from '@/lib/api';
import B2Image from '@/components/B2Image';
import CustomSelect from '@/components/CustomSelect';
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
              <B2Image
                fileNamePrefix={product.images[0] || ''}
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
                    <B2Image
                      fileNamePrefix={img}
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
                <CustomSelect
                  label="Chọn kích thước"
                  options={product.variants.map((variant) => ({
                    value: variant.id,
                    label: `${variant.size} – ${formatPrice(
                      Number(variant.price)
                    )}`,
                  }))}
                  value={selectedVariantId}
                  onChange={(value) => setSelectedVariantId(Number(value))}
                  className="w-full max-w-xs"
                />
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


