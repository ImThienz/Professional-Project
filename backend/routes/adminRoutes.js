const express = require("express");
const checkAdminRole = require("../middlewares/checkAdminRole");
const User = require("../models/User");
const router = express.Router();

router.get("/dashboard", checkAdminRole, (req, res) => {
  res.json({
    message: "Chào mừng Admin",
    username: req.user.username,
  });
});

router.get("/users", checkAdminRole, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi truy xuất người dùng" });
  }
});

// Xóa người dùng
router.delete("/users/:id", checkAdminRole, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "Người dùng đã được xóa thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa người dùng", error: error.message });
  }
});

// Thay đổi quyền người dùng
router.put("/users/:id/role", checkAdminRole, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!["admin", "reader"].includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.json({ message: "Đã thay đổi quyền thành công", user });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thay đổi quyền người dùng",
      error: error.message,
    });
  }
});

module.exports = router;
