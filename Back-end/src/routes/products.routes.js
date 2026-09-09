const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const products = new JsonCollection("products.json");

// Hàm chuẩn hóa dữ liệu dòng (Gộp key, kiểm tra đa ngôn ngữ Việt-Anh)
function normalizeRow(row) {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    normalized[key.trim().toLowerCase()] = row[key];
  });

  const pick = (...candidates) => {
    for (const c of candidates) {
      if (normalized[c] !== undefined && normalized[c] !== "")
        return normalized[c];
    }
    return undefined;
  };

  return {
    title: pick("title", "tên", "tên sản phẩm", "name", "product name"),
    price: pick("price", "giá", "giá bán"),
    category: pick("category", "danh mục", "category name"),
    image: pick("image", "ảnh", "hình ảnh", "image url"),
    description: pick("description", "mô tả"),
  };
}

// GET /products (Có phân trang, bộ lọc và tìm kiếm)
router.get("/", async (req, res) => {
  try {
    let items = await products.findAll();

    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      pageSize = 10,
    } = req.query;

    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (p) => p.title && p.title.toLowerCase().includes(query),
      );
    }
    if (category) {
      items = items.filter((p) => p.category === category);
    }
    if (minPrice) {
      items = items.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "price_asc")
      items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc")
      items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "newest") items = [...items].sort((a, b) => b.id - a.id);

    const total = items.length;
    const pageNum = Number(page);
    const sizeNum = Number(pageSize);
    const start = (pageNum - 1) * sizeNum;
    const paginated = items.slice(start, start + sizeNum);

    res.json({
      items: paginated,
      total,
      page: pageNum,
      pageSize: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy danh sách sản phẩm" });
  }
});

// GET /products/categories
router.get("/categories", async (req, res) => {
  try {
    const items = await products.findAll();
    const categories = [
      ...new Set(items.map((p) => p.category).filter(Boolean)),
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lấy danh mục" });
  }
});

// GET /products/category/:categoryName
router.get("/category/:categoryName", async (req, res) => {
  try {
    const items = await products.findAll();
    const filtered = items.filter(
      (p) => p.category === req.params.categoryName,
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lọc theo danh mục" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await products.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi tìm sản phẩm" });
  }
});

// POST /products (admin)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { title, price, description, category, image } = req.body;
      if (!title || price === undefined || !category) {
        return res.status(400).json({ message: "Thiếu title/price/category" });
      }
      const newProduct = await products.create({
        title,
        price: Number(price),
        description: description || "",
        category,
        image: image || "",
        rating: { rate: 0, count: 0 },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi tạo sản phẩm" });
    }
  },
);

// PUT /products/:id (thay toàn bộ, admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi cập nhật sản phẩm" });
    }
  },
);

// PATCH /products/:id (cập nhật 1 phần, admin)
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await products.updateById(req.params.id, req.body, {
        replace: false,
      });
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi sửa sản phẩm" });
    }
  },
);

// DELETE /products/:id (admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await products.deleteById(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      res.json(deleted);
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi xóa sản phẩm" });
    }
  },
);

// POST /products/bulk (Thêm hàng loạt - Đã gộp logic normalize và sửa lỗi I/O file JSON)
router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { products: rows } = req.body;
      if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({
          message: "Dữ liệu products gửi lên không hợp lệ hoặc trống",
        });
      }

      const valid = [];
      const skipped = [];

      // 1. Phân loại và lọc dữ liệu lỗi
      rows.forEach((raw, index) => {
        const row = normalizeRow(raw);
        if (!row.title || row.price === undefined || row.price === "") {
          skipped.push({
            rowIndex: index + 2, // +2 vì dòng 1 là header, Excel đếm từ 1
            reason: "Thiếu title hoặc price",
            raw,
          });
          return;
        }
        valid.push(row);
      });

      // 2. Ghi tuần tự vào tệp tin JSON qua vòng lặp `for...of` để không bị xung đột đọc/ghi (I/O)
      const created = [];
      for (const row of valid) {
        const item = await products.create({
          title: row.title,
          price: Number(row.price) || 0,
          category: row.category || "",
          image: row.image || "",
          description: row.description || "",
          rating: { rate: 0, count: 0 },
        });
        created.push(item);
      }

      // 3. Trả về thống kê số dòng thành công và số dòng thất bại
      res.status(201).json({
        count: created.length,
        skippedCount: skipped.length,
        skipped,
        items: created,
      });
    } catch (error) {
      console.error("Error in bulk create:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi import hàng loạt" });
    }
  },
);

module.exports = router;
