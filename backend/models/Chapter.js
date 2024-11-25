const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  comic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comic",
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
  content: {
    type: String,
  },
  images: {
    type: [String], // Mảng URL hình ảnh
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chapter", chapterSchema);
