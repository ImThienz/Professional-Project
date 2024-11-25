const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
console.log("Secret Key:", SECRET_KEY);
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Cấu hình CORS: Cho phép tất cả hoặc chỉ domain cụ thể
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend từ localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức cho phép
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"], // Các header cho phép
    credentials: true, // Nếu cần gửi cookie, cần cấu hình này
  })
);
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/doanchuyennganh", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

// Routes for comics
const comicRoutes = require("./routes/comicRoutes");
app.use("/api/v1/comics", comicRoutes);
app.use("/api/comics", comicRoutes);

// Routes for users
app.use("/api/users", userRoutes);

// Routes for payment
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/vnpay", paymentRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const adminController = require("./controllers/adminControl");
const adminRoutes = require("./routes/adminRoutes");

app.post("/api/admin/login", adminController.loginAdmin);
app.use("/api/admin", adminRoutes);

const adminComicRoutes = require("./routes/adminComicRoutes");
app.use("/api/v1/admin", adminComicRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Thêm route admin comics

//thêm route hiển thị chap truyện
const chapterRoutes = require("./routes/chapterRoutes");
app.use("/api/chapters", chapterRoutes);

// up ảnh chapter
app.use("/api", require("./routes/comicRoutes"));
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
