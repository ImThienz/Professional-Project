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

module.exports = router;
