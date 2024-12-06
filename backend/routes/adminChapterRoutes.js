const express = require("express");
const router = express.Router();
const Comic = require("../models/Comic");
const Chapter = require("../models/Chapter");

// Lấy danh sách comics và chapters
router.get("/comics-with-chapters", async (req, res) => {
  try {
    const comics = await Comic.find();
    const comicsWithChapters = await Promise.all(
      comics.map(async (comic) => {
        const chapters = await Chapter.find({ comic_id: comic._id });
        return { ...comic._doc, chapters };
      })
    );
    res.json(comicsWithChapters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching comics and chapters", error });
  }
});

// Thêm mới chapter
router.post("/", async (req, res) => {
  try {
    const { comic_id, chapter_number, title, content, images, price } =
      req.body;
    const newChapter = new Chapter({
      comic_id,
      chapter_number,
      title,
      content,
      images,
      price,
    });
    await newChapter.save();
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ message: "Error adding chapter", error });
  }
});

// Cập nhật chapter
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body, updated_at: new Date() };
    const updatedChapter = await Chapter.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: "Error updating chapter", error });
  }
});

// Xóa chapter
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Chapter.findByIdAndDelete(id);
    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chapter", error });
  }
});

module.exports = router;
