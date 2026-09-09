# Web Thương Mại Điện Tử Mini

Dự án web thương mại điện tử đơn giản, gồm 2 phần tách biệt:

- **`Back-end/`** — Mock API viết bằng Express, dữ liệu lưu trong file JSON (`Back-end/data/*.json`).
- **`Font-end/`** — Giao diện viết bằng React + Vite + Tailwind CSS, quản lý state bằng Zustand.

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) >= 18
- npm (đi kèm Node.js)

## 1. Cài đặt & chạy Back-end

```bash
cd Back-end
npm install
npm run dev     # chạy bằng nodemon, tự restart khi sửa code
# hoặc
npm start       # chạy thường, không auto-restart
```

Server chạy tại **http://localhost:4000**.

> Hiện tại `server.js` mới đăng ký 2 nhóm route: `/auth` và `/products`. Các file `carts.routes.js`, `users.routes.js`, `favorites.routes.js`, `orders.routes.js` đã có sẵn nhưng **chưa được gắn vào server**, nên các endpoint tương ứng sẽ trả về 404 cho tới khi được `app.use(...)` trong `server.js`.

### Biến môi trường (tùy chọn)

Tạo file `Back-end/.env` nếu muốn tùy chỉnh (không bắt buộc, có giá trị mặc định sẵn trong `src/config.js`):

```env
PORT=4000
ACCESS_SECRET=your-access-secret
REFRESH_SECRET=your-refresh-secret
```

Chi tiết danh sách endpoint: xem [`Back-end/README.md`](./Back-end/README.md).

## 2. Cài đặt & chạy Font-end

Mở terminal khác (giữ Back-end đang chạy):

```bash
cd Font-end
npm install
npm run dev
```

Giao diện chạy tại **http://localhost:5173** (Vite sẽ báo cổng cụ thể trong terminal).

### Biến môi trường

File `Font-end/.env` đã có sẵn, trỏ về Back-end local:

```env
VITE_API_URL = http://localhost:4000/
```

Nếu bạn đổi cổng Back-end, nhớ sửa lại giá trị này cho khớp.

## 3. Thứ tự chạy

1. Chạy **Back-end** trước (`http://localhost:4000`).
2. Chạy **Font-end** sau (`http://localhost:5173`), vì trang chủ gọi API `/products` từ Back-end lúc load.

## Cấu trúc thư mục

```
├── Back-end/
│   ├── src/
│   │   ├── routes/       # auth, products, users, carts, favorites, orders
│   │   ├── middleware/   # auth middleware (verify JWT)
│   │   ├── db.js
│   │   └── config.js
│   ├── data/              # "database" dạng file JSON
│   └── server.js
│
└── Font-end/
    ├── src/
    │   ├── Pages/         # Home, Cart, Product Detail, Login, Register
    │   ├── Components/    # UI dùng chung (Button, Card, PriceTag, ...)
    │   ├── Layouts/        # Header, Footer, TopBar
    │   ├── Stores/         # Zustand store (auth, cart)
    │   ├── Services/       # gọi API (axios)
    │   └── Routes/         # cấu hình react-router-dom
    └── vite.config.js
```

## Build production (Font-end)

```bash
cd Font-end
npm run build      # xuất ra Font-end/dist
npm run preview    # xem thử bản build
```

## Scripts nhanh

| Thư mục    | Lệnh          | Chức năng                          |
| ---------- | ------------- | ----------------------------------- |
| `Back-end` | `npm run dev` | Chạy server với nodemon (dev)       |
| `Back-end` | `npm start`   | Chạy server thường (production-ish) |
| `Font-end` | `npm run dev` | Chạy dev server Vite + HMR          |
| `Font-end` | `npm run build` | Build ra thư mục `dist`           |
| `Font-end` | `npm run lint` | Kiểm tra lỗi ESLint                |
