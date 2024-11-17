const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8080;

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

// Routes for chapters
const chapterRoutes = require("./routes/chapterRoutes");
app.use("/api/v1/chapters", chapterRoutes);

// Routes for payment
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/vnpay", paymentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
