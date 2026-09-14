const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { PORT } = require("./src/config");
const authRoutes = require("./src/routes/auth.routes");
const productsRoutes = require("./src/routes/products.routes");
const ordersRoutes = require("./src/routes/orders.routes");
const usersRoutes = require("./src/routes/users.routes");
const favoritesRoutes = require("./src/routes/favorites.routes");

// --- TỰ ĐỘNG TẠO THƯ MỤC DATA NẾU CHƯA CÓ ---
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ---------------------------------------------

const app = express();

app.use(cors());
app.use(express.json());

// Khai báo các cổng định tuyến API
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);
app.use("/favorites", favoritesRoutes);

app.get("/", (req, res) => {
  res.json({
    message:
      "Mock Store API đang chạy. Xem README.md để biết danh sách endpoint.",
  });
});

// 404 fallback - Xử lý khi không khớp endpoint nào
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint" });
});

// --- MIDDLEWARE XỬ LÝ LỖI TẬP TRUNG (Global Error Handler) ---
// Chặn đứng tình trạng sập server khi client gửi chuỗi JSON lỗi cấu trúc lên API
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ message: "Dữ liệu JSON gửi lên sai định dạng" });
  }
  res.status(500).json({ message: "Lỗi hệ thống ngoài dự kiến" });
});
// -------------------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock server chạy tại http://localhost:${PORT}`);
});
