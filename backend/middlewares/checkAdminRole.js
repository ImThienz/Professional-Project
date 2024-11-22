const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Xác thực không thành công" });
  }
};

module.exports = checkAdminRole;
