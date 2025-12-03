import { Product } from '@/types/product';

// TODO: Thay thế base URL bằng API endpoint thực tế cho các dịch vụ khác nhau
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Auth & Product API base URL
const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8386/api/v1';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface UserDetail {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  isActive?: boolean;
}

// Kiểu product theo backend
export interface BackendProductVariant {
  id: number;
  createdAt: string;
  updatedAt: string;
  size: string;
  price: string; // dạng "295000.00"
}

export interface BackendProductCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
}

export interface BackendProduct {
  id: number;
  createdAt: string;
  updatedAt: string;
  productName: string;
  description: string;
  images: string[];
  isColorMixingAvailable: boolean;
  variants: BackendProductVariant[];
  productCategory: BackendProductCategory;
}

/**
 * Đăng nhập
 */
export async function loginApi(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> | null = null;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // ignore JSON parse errors
  }

  if (!response.ok) {
    const message =
      (data && (data.message as string)) ||
      'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    throw new Error(message);
  }

  const raw = data as {
    accessToken: string;
    user: {
      id: number;
      fullName: string;
      email: string;
      role?: string;
      [key: string]: unknown;
    };
  };

  return {
    token: raw.accessToken,
    user: {
      id: raw.user.id,
      fullName: raw.user.fullName,
      email: raw.user.email,
      role: raw.user.role,
    },
  };
}

/**
 * Đăng ký
 */
export async function registerApi(payload: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> | null = null;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // ignore JSON parse errors
  }

  if (!response.ok) {
    const message =
      (data && (data.message as string)) ||
      'Đăng ký thất bại. Vui lòng thử lại.';
    throw new Error(message);
  }

  const raw = data as {
    accessToken: string;
    user: {
      id: number;
      fullName: string;
      email: string;
      role?: string;
      [key: string]: unknown;
    };
  };

  return {
    token: raw.accessToken,
    user: {
      id: raw.user.id,
      fullName: raw.user.fullName,
      email: raw.user.email,
      role: raw.user.role,
    },
  };
}

/**
 * Lấy thông tin người dùng hiện tại
 */
export async function getCurrentUser(accessToken: string): Promise<{
  id: number;
  createdAt?: string;
  updatedAt?: string;
  fullName: string;
  email: string;
  password?: string;
  role?: string;
  userDetails?: UserDetail[];
}> {
  const response = await fetch(`${AUTH_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        : 'Không thể tải thông tin người dùng.';
    throw new Error(message);
  }

  return response.json();
}

/**
 * Cập nhật địa chỉ đang sử dụng
 */
export async function updateActiveUserDetail(
  detailId: number,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${AUTH_BASE_URL}/users/detail`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ detailId }),
  });

  if (!response.ok) {
    const text = await response.text();
    const message =
      text || 'Không thể cập nhật địa chỉ mặc định. Vui lòng thử lại.';
    throw new Error(message);
  }
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
}

/**
 * Lấy danh sách tất cả sản phẩm (hỗ trợ phân trang & search)
 */
export async function getProducts(options?: {
  page?: number;
  search?: string;
}): Promise<ProductListResponse> {
  try {
    const url = new URL(`${AUTH_BASE_URL}/products`);
    if (options?.page != null) {
      url.searchParams.set('page', String(options.page));
    }
    if (options?.search) {
      url.searchParams.set('search', options.search);
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Không thể tải danh sách sản phẩm');
    }
    const json = (await response.json()) as {
      data: BackendProduct[];
      total: number;
      page: number | string;
    };
    return {
      items: (json.data || []).map(mapBackendProductToProduct),
      total: json.total ?? 0,
      page:
        typeof json.page === 'string' ? Number(json.page) : (json.page ?? 1),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Lấy sản phẩm theo ID
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/products/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Không thể tải thông tin sản phẩm');
    }
    const data = (await response.json()) as BackendProduct;
    return mapBackendProductToProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

const B2_DOWNLOAD_URL = 'https://f005.backblazeb2.com/file/Phuphiem';
const B2_FILE_PREFIX = 'test-uploads/';

/**
 * Normalize fileNamePrefix - tự động thêm prefix nếu chưa có
 * @param fileName - Tên file hoặc path (có thể có hoặc không có prefix)
 * @returns string - File path với prefix đầy đủ
 */
function normalizeB2FileName(fileName: string): string {
  if (!fileName) return '';

  // Nếu đã có prefix hoặc là full URL, return nguyên
  if (fileName.startsWith('http') || fileName.startsWith('test-uploads/')) {
    return fileName;
  }

  // Tự động thêm prefix
  return `${B2_FILE_PREFIX}${fileName}`;
}

/**
 * Build Backblaze B2 image URL từ fileNamePrefix và token
 * @param fileNamePrefix - Ví dụ: "1764668600636-logo.png" hoặc "test-uploads/1764668600636-logo.png"
 * @param token - Authorization token từ B2 API
 * @returns string - Full URL với authorization token
 */
export function buildB2ImageUrl(
  fileNamePrefix: string,
  token: string | null
): string {
  if (!fileNamePrefix || !token) return '/placeholder.jpg';

  const normalizedPath = normalizeB2FileName(fileNamePrefix);
  return `${B2_DOWNLOAD_URL}/${normalizedPath}?Authorization=${token}`;
}

function mapBackendProductToProduct(p: BackendProduct): Product {
  const firstVariant = p.variants[0];
  const priceNumber = firstVariant ? Number(firstVariant.price) : 0;

  // images từ backend giờ là fileNamePrefix, giữ nguyên để convert sau khi render
  return {
    id: String(p.id),
    name: p.productName,
    description: p.description,
    price: priceNumber,
    image: p.images[0] ?? '', // fileNamePrefix, sẽ convert thành URL khi render
    images: p.images, // Array of fileNamePrefix
    category: p.productCategory?.categoryName ?? 'Khác',
    inStock: true,
    featured: false,
  };
}

/**
 * Lấy sản phẩm theo danh mục
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?category=${category}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

/**
 * Tìm kiếm sản phẩm
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Gửi form liên hệ
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to submit contact form');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

export interface VnpayPaymentRequest {
  bankCode: string;
  locale: string;
  productVariants: Array<{
    variantId: number;
    quantity: number;
  }>;
  note?: string;
}

export interface VnpayPaymentResponse {
  paymentUrl?: string;
  orderId?: string;
  [key: string]: unknown;
}

/**
 * Tạo thanh toán VNPay
 */
export async function createVnpayPayment(
  payload: VnpayPaymentRequest,
  accessToken: string
): Promise<VnpayPaymentResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/payment/vnpay/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> | null = null;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // ignore JSON parse errors
  }

  if (!response.ok) {
    const message =
      (data && (data.message as string)) ||
      'Không thể tạo thanh toán. Vui lòng thử lại.';
    throw new Error(message);
  }

  return data as VnpayPaymentResponse;
}
