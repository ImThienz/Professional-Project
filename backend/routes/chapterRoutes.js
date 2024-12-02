const mongoose = require("mongoose");
const express = require("express");
const Chapter = require("../models/Chapter");
const Comic = require("../models/Comic");
const UserChapterPayment = require("../models/UserChapterPayment");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Lấy danh sách chapters theo comic_id

router.get("/byComic/:comicId", async (req, res) => {
  try {
    const comicId = req.params.comicId;

    // Kiểm tra comicId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(comicId)) {
      return res.status(400).json({ message: "Invalid comic ID format." });
    }

    // Tìm chapters theo comic_id
    const chapters = await Chapter.find({
      comic_id: new mongoose.Types.ObjectId(comicId),
    });

    if (chapters.length === 0) {
      return res
        .status(404)
        .json({ message: "No chapters found for this comic." });
    }

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Thêm chapter mới
router.post("/add", async (req, res) => {
  try {
    const { comic_id, chapter_number, title, content, images, price } =
      req.body;

    const newChapter = new Chapter({
      comic_id: mongoose.Types.ObjectId(comic_id),
      chapter_number,
      title,
      content,
      images,
      price, // Lưu giá chapter
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
router.put("/:chapterId/update-price", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ message: "Giá không hợp lệ." });
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.chapterId,
      { price },
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter không tồn tại." });
    }

    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:chapterId/view", authMiddleware, async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      console.error("user_id is missing in request.");
      return res.status(400).json({ message: "user_id is required." });
    }

    const userObjectId = new ObjectId(user_id); // Chuyển đổi sang ObjectId
    const chapterObjectId = new ObjectId(chapterId); // Chuyển đổi sang ObjectId

    console.log(
      "Checking payment for user_id:",
      userObjectId,
      "chapterId:",
      chapterObjectId
    );

    const paymentExists = await UserChapterPayment.findOne({
      user_id: userObjectId,
      chapter_id: chapterObjectId,
    });

    if (!paymentExists) {
      console.warn(
        "Payment not found for user_id:",
        userObjectId,
        "chapterId:",
        chapterObjectId
      );
      return res
        .status(403)
        .json({ message: "Payment required for this chapter." });
    }

    console.log(
      "Payment found for user_id:",
      userObjectId,
      "chapterId:",
      chapterObjectId
    );
    res.status(200).json({ message: "Access granted to chapter." });
  } catch (error) {
    console.error("Error checking payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
