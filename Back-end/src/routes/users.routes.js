const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const users = new JsonCollection("users.json");

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

/** Cho phép nếu là admin, hoặc chính chủ tài khoản (Đã sửa lỗi so sánh khác kiểu dữ liệu) */
function isSelfOrAdmin(req, res, next) {
  const targetId = Number(req.params.id);
  const currentUserId = Number(req.user.id); // Ép kiểu an toàn

  if (req.user.role === "admin" || currentUserId === targetId) {
    return next();
  }
  return res.status(403).json({ message: "Không có quyền truy cập" });
}

// GET /users (chỉ admin)
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const allUsers = await users.findAll();
      const items = allUsers.map(stripPassword);
      res.json(items);
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ message: "Lỗi hệ thống khi tải danh sách người dùng" });
    }
  },
);

// GET /users/:id (chính chủ hoặc admin)
router.get("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const item = await users.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(stripPassword(item));
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi tìm người dùng" });
  }
});

// POST /users (đăng ký user mới, mặc định role "customer")
router.post("/", async (req, res) => {
  try {
    const { email, username, password, name, address, phone, role } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Thiếu email/username/password" });
    }

    const allUsers = await users.findAll();
    const existed = allUsers.some((u) => u.username === username);
    if (existed) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    const newUser = await users.create({
      email,
      username,
      password, // Thực tế nên hash mật khẩu bằng thư viện bcrypt trước khi lưu
      name: name || { firstname: "", lastname: "" },
      address: address || {},
      phone: phone || "",
      // Không cho client tự phong admin qua route đăng ký công khai
      role: role === "admin" ? "customer" : role || "customer",
    });

    res.status(201).json(stripPassword(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký tài khoản" });
  }
});

// PUT /users/:id (chính chủ hoặc admin, thay toàn bộ)
router.put("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const body = { ...req.body };
    // chỉ admin mới được đổi role người khác thành admin
    if (body.role === "admin" && req.user.role !== "admin") {
      delete body.role;
    }
    const updated = await users.updateById(req.params.id, body, {
      replace: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(stripPassword(updated));
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi cập nhật thông tin" });
  }
});

// PATCH /users/:id (chính chủ hoặc admin, cập nhật 1 phần)
router.patch("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.role === "admin" && req.user.role !== "admin") {
      delete body.role;
    }
    const updated = await users.updateById(req.params.id, body, {
      replace: false,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(stripPassword(updated));
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi sửa thông tin" });
  }
});

// DELETE /users/:id (chỉ admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await users.deleteById(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy user" });
      res.json(stripPassword(deleted));
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi xóa người dùng" });
    }
  },
);

module.exports = router;
