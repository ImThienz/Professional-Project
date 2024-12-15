const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.error("Không có token trong request headers.");
      return res.status(401).json({ message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sử dụng `userId` từ token
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      console.error("Người dùng không phải admin hoặc không tồn tại:", user);
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    req.user = user;
    console.log("Admin được xác thực:", req.user._id);
    console.log("Role trong middleware:", req.user.role);
    next();
  } catch (error) {
    console.error("Xác thực admin thất bại:", error.message);
    res.status(401).json({ message: "Xác thực không thành công" });
  }
};

module.exports = checkAdminRole;
