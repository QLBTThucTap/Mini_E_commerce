const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const favorites = new JsonCollection("favorites.json");
const products = new JsonCollection("products.json");

// ===== Lấy danh sách yêu thích của user hiện tại =====
router.get("/", authenticateToken, async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);

    // Đọc file danh sách yêu thích
    const allFavorites = await favorites.findAll();
    const mine = allFavorites.filter((f) => Number(f.userId) === currentUserId);

    // --- TỐI ƯU HIỆU NĂNG: Dùng Lookup Map lấy thông tin sản phẩm O(1) ---
    const allProducts = await products.findAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    const enriched = mine.map((f) => ({
      ...f,
      product: productMap.get(Number(f.productId)) || null,
    }));
    // -------------------------------------------------------------------

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy danh sách yêu thích" });
  }
});

// ===== Thêm vào danh sách yêu thích =====
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Thiếu productId" });

    const currentUserId = Number(req.user.id);
    const targetProductId = Number(productId);

    const allFavorites = await favorites.findAll();
    const existed = allFavorites.find(
      (f) =>
        Number(f.userId) === currentUserId &&
        Number(f.productId) === targetProductId,
    );

    if (existed) {
      return res
        .status(409)
        .json({ message: "Đã có trong danh sách yêu thích" });
    }

    const created = await favorites.create({
      userId: currentUserId,
      productId: targetProductId,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi thêm yêu thích" });
  }
});

// ===== Xóa khỏi danh sách yêu thích =====
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);
    const targetProductId = Number(req.params.productId);

    const allFavorites = await favorites.findAll();
    const item = allFavorites.find(
      (f) =>
        Number(f.userId) === currentUserId &&
        Number(f.productId) === targetProductId,
    );

    if (!item) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trong danh sách yêu thích" });
    }

    await favorites.deleteById(item.id);
    res.json({ message: "Đã xóa khỏi yêu thích" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa yêu thích" });
  }
});

module.exports = router;
