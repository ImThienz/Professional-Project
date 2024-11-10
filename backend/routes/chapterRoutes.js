const express = require("express");
const Chapter = require("../models/Chapter");
const router = express.Router();

// Lấy tất cả chapters theo comic_id
router.get("/byComic/:comicId", async (req, res) => {
  try {
    const chapters = await Chapter.find({ comic_id: req.params.comicId });
    if (chapters.length === 0) {
      return res.status(404).json({ message: "Không có chương nào cho comic này." });
    }
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chapters: " + error.message });
  }
});

module.exports = router;
