const express = require("express");
const jwt = require("jsonwebtoken");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { ACCESS_SECRET } = require("../config");

const router = express.Router();
const users = new JsonCollection("users.json");

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return {
    ...safe,
    isLocked: Boolean(user.isLocked),
    role: user.role === "admin" ? "admin" : "user",
  };
}

function getOptionalUser(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch {
    return null;
  }
}

/** Cho phép nếu là admin, hoặc chính chủ tài khoản */
function isSelfOrAdmin(req, res, next) {
  const targetId = Number(req.params.id);
  const currentUserId = Number(req.user.id);

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

// POST /users (Tạo user: Công khai từ Register hoặc Admin tạo)
router.post("/", async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      name,
      fullName,
      address,
      phone,
      phoneNumber,
      gender,
      dateOfBirth,
      role,
      isLocked,
    } = req.body;

    const finalEmail = (email || "").trim().toLowerCase();
    const finalName = (fullName || (typeof name === "string" ? name : "") || "").trim();
    const finalPhone = (phoneNumber || phone || "").trim();

    if (!finalEmail || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const allUsers = await users.findAll();

    // Kiểm tra email trùng
    const emailExisted = allUsers.some(
      (u) => (u.email || "").toLowerCase() === finalEmail,
    );
    if (emailExisted) {
      return res.status(409).json({ message: "Email này đã được sử dụng" });
    }

    // Kiểm tra username trùng nếu có
    if (username) {
      const usernameExisted = allUsers.some(
        (u) => (u.username || "").toLowerCase() === username.trim().toLowerCase(),
      );
      if (usernameExisted) {
        return res.status(409).json({ message: "Tên đăng nhập đã tồn tại" });
      }
    }

    const currentUser = getOptionalUser(req);
    const isAdmin = currentUser && currentUser.role === "admin";

    // Chỉ admin mới có quyền tạo tài khoản role "admin"
    let finalRole = "user";
    if (isAdmin && role === "admin") {
      finalRole = "admin";
    }

    const newUser = await users.create({
      fullName: finalName || (typeof name === "object" ? `${name.firstname || ""} ${name.lastname || ""}`.trim() : "") || username || finalEmail,
      username: username || finalEmail,
      email: finalEmail,
      phoneNumber: finalPhone,
      gender: gender || "Other",
      dateOfBirth: dateOfBirth || "",
      address: address || { city: "", district: "" },
      password: String(password),
      role: finalRole,
      isLocked: isAdmin && typeof isLocked === "boolean" ? isLocked : false,
    });

    res.status(201).json(stripPassword(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi tạo tài khoản" });
  }
});

// PATCH /users/:id/lock (Khóa / mở khóa tài khoản - chỉ admin)
router.patch(
  "/:id/lock",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const targetId = Number(req.params.id);
      const currentUserId = Number(req.user.id);

      if (targetId === currentUserId) {
        return res
          .status(400)
          .json({ message: "Không thể tự khóa tài khoản của chính mình" });
      }

      const user = await users.findById(targetId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const nextLockStatus =
        req.body.isLocked !== undefined
          ? Boolean(req.body.isLocked)
          : !user.isLocked;

      const updated = await users.updateById(
        targetId,
        { isLocked: nextLockStatus },
        { replace: false },
      );

      res.json(stripPassword(updated));
    } catch (error) {
      console.error("Error toggling user lock:", error);
      res.status(500).json({ message: "Lỗi hệ thống khi đổi trạng thái khóa" });
    }
  },
);

// PUT /users/:id (chính chủ hoặc admin)
router.put("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const currentUserId = Number(req.user.id);
    const body = { ...req.body };

    // Không cho admin tự khóa chính mình
    if (targetId === currentUserId && body.isLocked === true) {
      return res
        .status(400)
        .json({ message: "Không thể tự khóa tài khoản của chính mình" });
    }

    // Không cho admin tự hạ role của mình
    if (targetId === currentUserId && body.role && body.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Không thể tự gỡ quyền admin của chính mình" });
    }

    // Chỉ admin mới có quyền đổi role
    if (body.role && req.user.role !== "admin") {
      delete body.role;
    }

    // Nếu không nhập password mới khi cập nhật, giữ nguyên password cũ
    if (!body.password) {
      delete body.password;
    }

    const updated = await users.updateById(targetId, body, {
      replace: false,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(stripPassword(updated));
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi cập nhật thông tin" });
  }
});

// PATCH /users/:id (chính chủ hoặc admin)
router.patch("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const currentUserId = Number(req.user.id);
    const body = { ...req.body };

    // Không cho admin tự khóa chính mình
    if (targetId === currentUserId && body.isLocked === true) {
      return res
        .status(400)
        .json({ message: "Không thể tự khóa tài khoản của chính mình" });
    }

    // Không cho admin tự hạ role của mình
    if (targetId === currentUserId && body.role && body.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Không thể tự gỡ quyền admin của chính mình" });
    }

    // Chỉ admin mới có quyền đổi role hoặc đổi trạng thái lock
    if (req.user.role !== "admin") {
      delete body.role;
      delete body.isLocked;
    }

    // Nếu không nhập password mới, bỏ qua không ghi đè
    if (!body.password) {
      delete body.password;
    }

    // Chuẩn hóa fullName / phoneNumber nếu có
    if (body.name && !body.fullName) {
      body.fullName = typeof body.name === "string" ? body.name : `${body.name.firstname || ""} ${body.name.lastname || ""}`.trim();
    }
    if (body.phone && !body.phoneNumber) {
      body.phoneNumber = body.phone;
    }

    const updated = await users.updateById(targetId, body, {
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
      const targetId = Number(req.params.id);
      const currentUserId = Number(req.user.id);

      if (targetId === currentUserId) {
        return res
          .status(400)
          .json({ message: "Không thể tự xóa tài khoản của chính mình" });
      }

      const deleted = await users.deleteById(targetId);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy user" });
      res.json(stripPassword(deleted));
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống khi xóa người dùng" });
    }
  },
);

module.exports = router;

