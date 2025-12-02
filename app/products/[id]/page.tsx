import { notFound } from 'next/navigation';
import type { BackendProduct } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const { id } = await props.params;
  let product;
  try {
    product = await fetchProductDetail(id);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

async function fetchProductDetail(id: string): Promise<BackendProduct> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8386/api/v1'}/products/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Không thể tải thông tin sản phẩm');
  }

  return (await response.json()) as BackendProduct;
}
