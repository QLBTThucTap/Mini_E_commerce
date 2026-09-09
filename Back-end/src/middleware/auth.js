const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config");

/** Bắt buộc phải có access token hợp lệ trong header Authorization: Bearer <token> */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    // Thực thi jwt.verify đồng bộ giúp code phẳng hơn, không bị lồng hàm callback
    const payload = jwt.verify(token, ACCESS_SECRET);

    req.user = payload; // { id, username, email, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

/** Dùng sau authenticateToken. Ví dụ: authorizeRoles("admin") */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
