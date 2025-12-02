import Link from 'next/link';
import { Product } from '@/types/product';
import B2Image from '@/components/B2Image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <B2Image
            fileNamePrefix={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 rounded-full bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
              Nổi bật
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-lg font-semibold text-white">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-rose-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
