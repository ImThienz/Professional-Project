const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Secret key cho JWT
const SECRET_KEY = "sYqXlRys1w+DCjEdkMEeCDoVUwY1Ac5hxuBPznmc9cE";

// Tạo JWT
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

// Middleware xác thực
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};

// Đăng ký
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra username hoặc email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username hoặc email đã tồn tại" });
    }

    // Tạo user mới với role mặc định là 'reader'
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// Đăng nhập
// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1d",
    });

    // Trả về token, user_id và username
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user_id: user._id, // Thêm user_id
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

module.exports = router;
