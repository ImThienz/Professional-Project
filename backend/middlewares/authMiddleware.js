const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    console.error("Không tìm thấy token trong request headers.");
    return res.status(401).json({ error: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token được xác thực:", verified);

    req.user = await User.findById(verified.id);
    if (!req.user) {
      console.error("Không tìm thấy user từ token:", verified.id);
      return res.status(401).json({ error: "User not found" });
    }

    console.log("User được xác thực:", req.user._id);
    next();
  } catch (err) {
    console.error("Token không hợp lệ:", err.message);
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = authMiddleware;
