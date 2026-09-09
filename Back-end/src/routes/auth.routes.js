const express = require("express");
const jwt = require("jsonwebtoken");
const JsonCollection = require("../db");
const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../config");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const usersCollection = new JsonCollection("users.json");

// Lưu refresh token hợp lệ trong bộ nhớ
let validRefreshTokens = [];

function signTokens(userSafe) {
  const accessToken = jwt.sign(userSafe, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(userSafe, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Chờ đọc dữ liệu từ file users.json
    const users = await usersCollection.findAll();
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    }

    const { password: _, ...userSafe } = user; // Không trả password về client
    const { accessToken, refreshToken } = signTokens(userSafe);
    validRefreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken, user: userSafe });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập" });
  }
});

// ===== REFRESH TOKEN =====
router.post("/refresh-token", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || !validRefreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: "Refresh token không hợp lệ" });
    }

    try {
      // Dùng jwt.verify đồng bộ bên trong try/catch để code phẳng và sạch hơn
      const payload = jwt.verify(refreshToken, REFRESH_SECRET);

      const { iat, exp, ...userSafe } = payload;
      const newAccessToken = jwt.sign(userSafe, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });

      res.json({ newAccessToken });
    } catch (err) {
      // Nếu token hết hạn hoặc sai chữ ký, lọc bỏ khỏi mảng bộ nhớ
      validRefreshTokens = validRefreshTokens.filter((t) => t !== refreshToken);
      return res
        .status(401)
        .json({ message: "Refresh token hết hạn hoặc không hợp lệ" });
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi làm mới token" });
  }
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  try {
    const { refreshToken } = req.body;
    validRefreshTokens = validRefreshTokens.filter((t) => t !== refreshToken);
    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng xuất" });
  }
});

// ===== ME (protected) =====
router.get("/me", authenticateToken, (req, res) => {
  try {
    const { iat, exp, ...userSafe } = req.user;
    res.json(userSafe);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lấy thông tin cá nhân" });
  }
});

module.exports = router;
