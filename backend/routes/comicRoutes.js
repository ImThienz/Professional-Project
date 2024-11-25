const express = require("express");
const Comic = require("../models/Comic");
const Chapter = require("../models/Chapter"); // Thêm nếu cần sử dụng Chapter model
const router = express.Router();

// API để lấy tất cả comics
router.get("/getAll", async (req, res) => {
  try {
    const comics = await Comic.find();
    res.status(200).json(comics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route tìm kiếm truyện theo tiêu đề
router.get("/search", async (req, res) => {
  try {
    const { title } = req.query; // Lấy từ khóa tìm kiếm từ query
    if (!title) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
    }
    const comics = await Comic.find({
      title: { $regex: title, $options: "i" }, // Tìm kiếm gần đúng, không phân biệt hoa thường
    });
    res.status(200).json(comics);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// API để lấy chi tiết comic theo ID
router.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (comic) {
      res.status(200).json(comic);
    } else {
      res.status(404).json({ message: "Comic not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để lấy chapters theo comic_id
router.get("/byComic/:comicId", async (req, res) => {
  try {
    const chapters = await Chapter.find({ comic_id: req.params.comicId });
    if (chapters.length === 0) {
      return res
        .status(404)
        .json({ message: "No chapters available for this comic." });
    }
    res.status(200).json(chapters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chapters: " + error.message });
  }
});

// Thêm comic mới
router.post("/add", async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      description,
      price,
      cover_image,
      category_id,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }

    const newComic = new Comic({
      title,
      author,
      genre,
      description,
      price,
      cover_image,
      category_id,
    });
    const savedComic = await newComic.save();
    res.status(201).json(savedComic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa comic
router.delete("/:id", async (req, res) => {
  try {
    const deletedComic = await Comic.findByIdAndDelete(req.params.id);
    if (!deletedComic)
      return res.status(404).json({ message: "Comic not found" });
    res.json({ message: "Comic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sửa comic
router.put("/:id", async (req, res) => {
  try {
    const updatedComic = await Comic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedComic)
      return res.status(404).json({ message: "Comic not found" });
    res.json(updatedComic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
