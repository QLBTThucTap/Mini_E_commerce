# Mock Store API

Server local, dùng để học tập/test. Dữ liệu lấy từ (products, users, carts) và được lưu trong `data/*.json`. Mỗi lần CRUD sẽ ghi thẳng vào các file này, nên dữ liệu **có persist** giữa các lần request (nhưng sẽ mất nếu bạn xoá file hoặc revert bằng git).

## Cài đặt & chạy

```bash
npm install
npm run dev
# hoặc
npm start
```

Server chạy ở `http://localhost:4000`.

## Auth

| Method | Endpoint              | Mô tả                                        | Quyền           |
| ------ | --------------------- | -------------------------------------------- | --------------- |
| POST   | `/auth/login`         | Đăng nhập, trả về accessToken + refreshToken | public          |
| POST   | `/auth/refresh-token` | Lấy accessToken mới từ refreshToken          | public          |
| POST   | `/auth/logout`        | Vô hiệu hoá refreshToken                     | public          |
| GET    | `/auth/me`            | Lấy thông tin user hiện tại                  | cần accessToken |

Access token hết hạn sau **60s** (cố tình để dễ test refresh flow), refresh token hết hạn sau **7 ngày**.

Gửi token qua header: `Authorization: Bearer <accessToken>`

## Products

| Method | Endpoint                           | Mô tả                                       | Quyền  |
| ------ | ---------------------------------- | ------------------------------------------- | ------ |
| GET    | `/products`                        | Lấy tất cả (hỗ trợ `?limit=&sort=asc/desc`) | public |
| GET    | `/products/categories`             | Lấy danh sách category                      | public |
| GET    | `/products/category/:categoryName` | Lọc theo category                           | public |
| GET    | `/products/:id`                    | Lấy 1 sản phẩm                              | public |
| POST   | `/products`                        | Tạo sản phẩm mới                            | admin  |
| PUT    | `/products/:id`                    | Cập nhật toàn bộ                            | admin  |
| PATCH  | `/products/:id`                    | Cập nhật 1 phần                             | admin  |
| DELETE | `/products/:id`                    | Xoá sản phẩm                                | admin  |

## Users

| Method | Endpoint     | Mô tả                                       | Quyền                |
| ------ | ------------ | ------------------------------------------- | -------------------- |
| GET    | `/users`     | Lấy tất cả user (ẩn password)               | admin                |
| GET    | `/users/:id` | Lấy 1 user (ẩn password)                    | chính chủ hoặc admin |
| POST   | `/users`     | Đăng ký user mới (role mặc định `customer`) | public               |
| PUT    | `/users/:id` | Cập nhật toàn bộ                            | chính chủ hoặc admin |
| PATCH  | `/users/:id` | Cập nhật 1 phần                             | chính chủ hoặc admin |
| DELETE | `/users/:id` | Xoá user                                    | admin                |

Lưu ý: chỉ admin mới có thể gán `role: "admin"` cho user khác qua PUT/PATCH; user thường tự đăng ký qua POST luôn bị ép về `role: "customer"` dù có gửi field `role` lên.

## Carts

| Method | Endpoint              | Mô tả                               | Quyền         |
| ------ | --------------------- | ----------------------------------- | ------------- |
| GET    | `/carts`              | Lấy tất cả (hỗ trợ `?limit=&sort=`) | public        |
| GET    | `/carts/user/:userId` | Lấy giỏ hàng theo userId            | public        |
| GET    | `/carts/:id`          | Lấy 1 giỏ hàng                      | public        |
| POST   | `/carts`              | Tạo giỏ hàng mới                    | cần đăng nhập |
| PUT    | `/carts/:id`          | Cập nhật toàn bộ                    | cần đăng nhập |
| PATCH  | `/carts/:id`          | Cập nhật 1 phần                     | cần đăng nhập |
| DELETE | `/carts/:id`          | Xoá giỏ hàng                        | cần đăng nhập |

## Test nhanh bằng curl

```bash
# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johnd","password":"m38rmF$"}'

# Lấy profile (thay <TOKEN> bằng accessToken vừa nhận)
curl http://localhost:4000/auth/me -H "Authorization: Bearer <TOKEN>"

# Tạo sản phẩm mới (cần admin token)
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Áo test","price":19.99,"category":"men'"'"'s clothing"}'
```

## Ghi chú cho việc học

- Đây là mock server, password lưu plaintext trong JSON — **không** làm vậy với project thật (cần hash bằng bcrypt).
- `validRefreshTokens` lưu trong bộ nhớ (RAM) nên sẽ mất khi restart server — thực tế nên lưu DB hoặc Redis.
- File `src/db.js` là 1 lớp đọc/ghi JSON đơn giản, không xử lý ghi đồng thời (race condition) — không dùng cho production.
