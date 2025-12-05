export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  isColorMixingAvailable?: boolean;
}

export interface CartItem {
  id: string;
  productId: number | string;
  productName: string;
  image: string;
  variantId?: number;
  size?: string;
  price: number;
  quantity: number;
  note?: string;
  isColorMixingAvailable?: boolean;
}
