# Handmade Store - E-commerce Frontend

Website bán đồ handmade được xây dựng với Next.js 14, TypeScript và Tailwind CSS.

## 🚀 Tính năng

- ✅ Trang chủ với sản phẩm nổi bật
- ✅ Trang danh sách sản phẩm với tìm kiếm và lọc theo danh mục
- ✅ Trang chi tiết sản phẩm
- ✅ Trang giỏ hàng (sẵn sàng tích hợp API)
- ✅ Trang về chúng tôi
- ✅ Trang liên hệ với form
- ✅ Responsive design
- ✅ TypeScript cho type safety
- ✅ Mock data sẵn sàng để thay thế bằng API
- ✅ Prettier cho code formatting
- ✅ ESLint tích hợp với Prettier

## 📁 Cấu trúc thư mục

```
fe/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Trang chủ
│   ├── products/          # Trang sản phẩm
│   ├── cart/              # Trang giỏ hàng
│   ├── about/             # Trang về chúng tôi
│   └── contact/           # Trang liên hệ
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── types/                # TypeScript types
│   └── product.ts
└── lib/                  # Utilities & mock data
    └── mockData.ts
```

## 🛠️ Cài đặt và chạy

### Yêu cầu

- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Build production

```bash
npm run build
npm start
```

## 🎨 Code Formatting

Project sử dụng Prettier và ESLint để đảm bảo code style nhất quán.

### Format code

```bash
# Format tất cả files
npm run format

# Kiểm tra format (không sửa)
npm run format:check

# Fix ESLint errors
npm run lint:fix
```

### Cấu hình

- **Prettier**: `.prettierrc` - Cấu hình format style
- **ESLint**: `eslint.config.mjs` - Tích hợp với Prettier
- **EditorConfig**: `.editorconfig` - Cấu hình editor

### VS Code Setup

Để tự động format khi save, thêm vào `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 🔌 Tích hợp API

Project này được thiết kế để dễ dàng tích hợp API. Các điểm cần thay đổi:

1. **Mock Data**: Thay thế `lib/mockData.ts` bằng API calls
2. **Product Fetching**: Tạo API service trong `lib/api.ts`
3. **Cart Management**: Tích hợp cart state management (Context API hoặc Zustand)
4. **Form Submission**: Kết nối form liên hệ với backend API

### Ví dụ tích hợp API:

```typescript
// lib/api.ts
export async function getProducts() {
  const res = await fetch('https://your-api.com/products');
  return res.json();
}
```

## 🎨 Customization

- **Colors**: Chỉnh sửa màu sắc trong `app/globals.css` và các component
- **Fonts**: Thay đổi font trong `app/layout.tsx`
- **Metadata**: Cập nhật SEO metadata trong `app/layout.tsx`

## 📝 Notes

- Tất cả dữ liệu hiện tại là mock data
- Cart chưa có state management (cần tích hợp sau)
- Images sử dụng placeholder (cần thay bằng ảnh thật)
- Form liên hệ chưa kết nối backend

## 🚀 Deploy

Có thể deploy lên Vercel một cách dễ dàng:

```bash
npm install -g vercel
vercel
```

Hoặc kết nối GitHub repo với Vercel để tự động deploy.

## 📄 License

MIT
