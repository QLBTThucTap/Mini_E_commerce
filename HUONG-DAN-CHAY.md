# Hướng dẫn chạy dự án

# Link deploy: https://mini-e-commerce-red.vercel.app/

## 1. Backend

```bash
cd Back-end
npm install
npm run dev      # http://localhost:4000
```

## 2. Frontend

```bash
cd Font-end
npm install
npm run dev       # http://localhost:5173
```

> Frontend đã cấu hình sẵn `VITE_API_URL=http://localhost:4000/` trong `Font-end/.env`.

## 3. Tài khoản demo

Mật khẩu tất cả tài khoản: **`123456`**

| Vai trò | Email               | Ghi chú             |
| ------- | ------------------- | ------------------- |
| Admin   | `Huyen`             | Truy cập `/admin/*` |
| User 1  | `Tran Thi Minh Anh` | Người dùng thường   |
| User 2  | `Tran Anh Duc`      | Người dùng thường   |
