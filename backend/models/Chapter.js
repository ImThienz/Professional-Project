const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  comic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comic", // Liên kết với Comic model
    required: true,
  },
  chapter_number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  page_count: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true, // URL của hình ảnh bìa chapter
  },
});

const Chapter = mongoose.model("Chapter", chapterSchema);
module.exports = Chapter;
