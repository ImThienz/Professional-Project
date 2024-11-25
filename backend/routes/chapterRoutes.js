const express = require("express");
const Chapter = require("../models/Chapter");
const Comic = require("../models/Comic");
const router = express.Router();

// Lấy danh sách chapters theo comic_id
const mongoose = require("mongoose");

router.get("/byComic/:comicId", async (req, res) => {
  try {
    const comicId = mongoose.Types.ObjectId.isValid(req.params.comicId)
      ? new mongoose.Types.ObjectId(req.params.comicId)
      : null;

    if (!comicId) {
      return res.status(400).json({ message: "Invalid comic ID format." });
    }

    console.log("comicId:", comicId); // Log comicId đã chuyển đổi

    const chapters = await Chapter.find({ comic_id: comicId });

    console.log("Fetched chapters:", chapters); // Log dữ liệu lấy được

    if (chapters.length === 0) {
      return res
        .status(404)
        .json({ message: "No chapters found for this comic." });
    }

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Thêm chapter mới
router.post("/add", async (req, res) => {
  try {
    const { comic_id, chapter_number, title, content, images } = req.body;

    const newChapter = new Chapter({
      comic_id: mongoose.Types.ObjectId(comic_id),
      chapter_number,
      title,
      content,
      images,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedChapter = await newChapter.save();
    res.status(201).json(savedChapter);
  } catch (error) {
    console.error("Error adding chapter:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Xóa chapter
router.delete("/:id", async (req, res) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!deletedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sửa chapter
router.put("/:chapterId/addImages", async (req, res) => {
  try {
    const { images } = req.body;

    // Kiểm tra xem mảng hình ảnh có hợp lệ không
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid images array." });
    }

    // Thêm URL hình ảnh vào chapter
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.chapterId,
      { $push: { images: { $each: images } } }, // Thêm mảng URL hình ảnh vào trường images
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
