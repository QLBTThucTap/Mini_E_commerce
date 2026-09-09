const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Gom toàn bộ instance dữ liệu lên đầu file để tái sử dụng bộ nhớ
const orders = new JsonCollection("orders.json");
const carts = new JsonCollection("carts.json");
const productsCollection = new JsonCollection("products.json");

// Tạo đơn hàng từ giỏ hàng active hiện tại
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;

    // Đồng nhất kiểu dữ liệu của userId
    const currentUserId = Number(req.user.id);

    // Chờ lấy toàn bộ giỏ hàng từ file (bất đồng bộ)
    const allCarts = await carts.findAll();
    const activeCart = allCarts.find(
      (c) => Number(c.userId) === currentUserId && c.status === "active",
    );

    if (
      !activeCart ||
      !activeCart.products ||
      activeCart.products.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng đang trống hoặc không tồn tại" });
    }

    // --- TỐI ƯU HIỆU NĂNG TÍNH TỔNG TIỀN (Lookup Map) ---
    const allProducts = await productsCollection.findAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    const total = activeCart.products.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    // ----------------------------------------------------

    // Đóng giỏ hàng ngay lập tức để chặn Race Conditions (ngăn bấm đặt hàng 2 lần)
    const updatedCart = await carts.updateById(
      activeCart.id,
      { status: "ordered" },
      { replace: false },
    );

    // Nếu vì lý do nào đó không update được giỏ hàng (bị can thiệp song song), hủy quy trình
    if (!updatedCart) {
      return res
        .status(400)
        .json({ message: "Xử lý giỏ hàng thất bại, vui lòng thử lại" });
    }

    // Tạo đơn hàng mới
    const newOrder = await orders.create({
      userId: currentUserId,
      products: activeCart.products,
      total,
      shippingInfo,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Tạo một giỏ hàng active mới hoàn toàn trống cho người dùng
    await carts.create({
      userId: currentUserId,
      status: "active",
      products: [],
      date: new Date().toISOString(),
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xử lý đơn hàng" });
  }
});

// Lấy lịch sử đơn hàng của bản thân hoặc admin kiểm tra người khác
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const targetId = Number(req.params.userId);
    const currentUserId = Number(req.user.id);

    if (req.user.role !== "admin" && currentUserId !== targetId) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const allOrders = await orders.findAll();
    const items = allOrders.filter((o) => Number(o.userId) === targetId);
    res.json(items);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi lấy lịch sử đơn hàng" });
  }
});

// Admin lấy toàn bộ đơn hàng của hệ thống
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const allOrders = await orders.findAll();
      res.json(allOrders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res
        .status(500)
        .json({ message: "Lỗi hệ thống khi lấy danh sách đơn hàng" });
    }
  },
);

// Admin cập nhật trạng thái đơn hàng (pending -> shipping -> delivered)
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await orders.updateById(
        req.params.id,
        { status: req.body.status },
        { replace: false },
      );
      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi cập nhật trạng thái" });
    }
  },
);

module.exports = router;
