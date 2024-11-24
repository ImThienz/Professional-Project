const express = require("express");
const Comic = require("../models/Comic");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Khởi tạo multer để xử lý file tải lên
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Lưu tệp vào thư mục uploads
  },
  filename: (req, file, cb) => {
    // Tạo tên tệp duy nhất
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Lấy tất cả comics
router.get("/", async (req, res) => {
  try {
    const comics = await Comic.find();
    res.json({ comics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy một comic theo ID
router.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }
    res.json(comic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mới comic (POST request)
router.post("/", upload.single("cover_image"), async (req, res) => {
  const comic = new Comic({
    title: req.body.title,
    comic_id: req.body.comic_id,
    author: req.body.author,
    price: req.body.price,
    category_id: req.body.category_id,
    genre: req.body.genre,
    description: req.body.description,
    cover_image: req.file ? `/uploads/${req.file.filename}` : null, // Đảm bảo lưu đường dẫn hình ảnh
  });

  try {
    const newComic = await comic.save();
    res.status(201).json(newComic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật comic (PUT request)
router.put("/:id", upload.single("cover_image"), async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    // Cập nhật thông tin comic
    comic.title = req.body.title || comic.title;
    comic.comic_id = req.body.comic_id || comic.comic_id;
    comic.author = req.body.author || comic.author;
    comic.price = req.body.price || comic.price;
    comic.category_id = req.body.category_id || comic.category_id;
    comic.genre = req.body.genre || comic.genre;
    comic.description = req.body.description || comic.description;

    // Nếu có hình ảnh mới, cập nhật đường dẫn tệp vào cơ sở dữ liệu
    if (req.file) {
      comic.cover_image = `/uploads/${req.file.filename}`; // Đường dẫn hình ảnh
    }

    // Lưu comic đã cập nhật
    const updatedComic = await comic.save();

    // Trả về kết quả sau khi cập nhật
    res.json(updatedComic);
  } catch (err) {
    console.error("Error updating comic:", err);
    res.status(500).json({ message: err.message });
  }
});

// Xóa comic (DELETE request)
router.delete("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    await comic.remove();
    res.json({ message: "Comic deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
