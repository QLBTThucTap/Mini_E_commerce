const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Gom toàn bộ instance dữ liệu lên đầu file để tái sử dụng bộ nhớ
const orders = new JsonCollection("orders.json");
const carts = new JsonCollection("carts.json");
const productsCollection = new JsonCollection("products.json");

const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config");

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (token) {
    try {
      const payload = jwt.verify(token, ACCESS_SECRET);
      req.user = payload;
    } catch (err) {
      // Bỏ qua lỗi token hết hạn/không hợp lệ, tiếp tục xử lý như khách
    }
  }
  next();
}

// Tạo đơn hàng từ giỏ hàng client hoặc giỏ hàng active hiện tại
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, products: clientProducts, total: clientTotal } = req.body;

    const currentUserId = req.user
      ? Number(req.user.id)
      : req.body.userId
        ? Number(req.body.userId)
        : null;

    const allProducts = await productsCollection.findAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    let orderProducts = [];
    let calculatedTotal = 0;

    // 1. Nếu client truyền trực tiếp danh sách sản phẩm trong giỏ
    if (Array.isArray(clientProducts) && clientProducts.length > 0) {
      orderProducts = clientProducts.map((item) => {
        const pId = Number(item.productId || item.id);
        const p = productMap.get(pId);
        const qty = Math.max(1, Number(item.quantity) || 1);
        const price = p ? Number(p.price) : Number(item.price) || 0;
        calculatedTotal += price * qty;
        return {
          productId: pId,
          quantity: qty,
          title: item.title || p?.title || `Sản phẩm #${pId}`,
          price: price,
          image: item.image || p?.image || "",
        };
      });
    } else if (currentUserId) {
      // 2. Ngược lại nếu không truyền products, tìm trong giỏ active trên database
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

      orderProducts = activeCart.products.map((item) => {
        const pId = Number(item.productId);
        const p = productMap.get(pId);
        const qty = Number(item.quantity) || 1;
        const price = p?.price || 0;
        calculatedTotal += price * qty;
        return {
          productId: pId,
          quantity: qty,
          title: p?.title || `Sản phẩm #${pId}`,
          price: price,
          image: p?.image || "",
        };
      });

      await carts.updateById(
        activeCart.id,
        { status: "ordered" },
        { replace: false },
      );

      await carts.create({
        userId: currentUserId,
        status: "active",
        products: [],
        date: new Date().toISOString(),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Giỏ hàng đang trống hoặc không có sản phẩm" });
    }

    const shippingFee =
      calculatedTotal >= 199 || calculatedTotal === 0 ? 0 : 9.5;
    const finalTotal =
      clientTotal !== undefined
        ? Number(clientTotal)
        : Number((calculatedTotal + shippingFee).toFixed(2));

    // Tạo đơn hàng mới
    const newOrder = await orders.create({
      userId: currentUserId,
      products: orderProducts,
      total: finalTotal,
      shippingInfo: shippingInfo || {},
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      createdAt: new Date().toISOString(),
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
// Admin tạo đơn hàng thủ công (nhập tay thông tin khách, không qua giỏ hàng)
router.post(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { shippingInfo, paymentMethod, products: items, status } = req.body;

      if (
        !shippingInfo?.fullName ||
        !shippingInfo?.phone ||
        !shippingInfo?.address
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin khách hàng (họ tên/sđt/địa chỉ)" });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Đơn hàng cần ít nhất 1 sản phẩm" });
      }

      const allProducts = await productsCollection.findAll();
      const productMap = new Map(allProducts.map((p) => [p.id, p]));

      let total = 0;
      for (const item of items) {
        const product = productMap.get(Number(item.productId));
        if (!product) {
          return res
            .status(400)
            .json({ message: `Không tìm thấy sản phẩm #${item.productId}` });
        }
        if (!item.quantity || item.quantity <= 0) {
          return res
            .status(400)
            .json({ message: "Số lượng sản phẩm phải lớn hơn 0" });
        }
        total += product.price * Number(item.quantity);
      }

      const newOrder = await orders.create({
        userId: null, // đơn tạo thủ công bởi admin, không gắn tài khoản khách
        products: items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
        total,
        shippingInfo,
        paymentMethod: paymentMethod || "cod",
        status: status || "pending",
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating admin order:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng" });
    }
  },
);

// Admin sửa toàn bộ đơn hàng (khách hàng, sản phẩm, thanh toán, trạng thái)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { shippingInfo, paymentMethod, products: items, status } = req.body;

      if (
        !shippingInfo?.fullName ||
        !shippingInfo?.phone ||
        !shippingInfo?.address
      ) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin khách hàng (họ tên/sđt/địa chỉ)" });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Đơn hàng cần ít nhất 1 sản phẩm" });
      }

      const allProducts = await productsCollection.findAll();
      const productMap = new Map(allProducts.map((p) => [p.id, p]));

      let total = 0;
      for (const item of items) {
        const product = productMap.get(Number(item.productId));
        if (!product) {
          return res
            .status(400)
            .json({ message: `Không tìm thấy sản phẩm #${item.productId}` });
        }
        if (!item.quantity || item.quantity <= 0) {
          return res
            .status(400)
            .json({ message: "Số lượng sản phẩm phải lớn hơn 0" });
        }
        total += product.price * Number(item.quantity);
      }

      const updated = await orders.updateById(
        req.params.id,
        {
          products: items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
          })),
          total,
          shippingInfo,
          paymentMethod: paymentMethod || "cod",
          status: status || "pending",
        },
        { replace: false },
      );

      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi cập nhật đơn hàng" });
    }
  },
);

// Admin xóa đơn hàng
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await orders.deleteById(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      res.json(deleted);
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi xóa đơn hàng" });
    }
  },
);
module.exports = router;
