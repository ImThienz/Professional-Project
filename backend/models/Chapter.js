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
    type: [String],
    default: [],
  },
  price: {
    // Thêm trường giá
    type: Number,
    required: true,
    default: 10000, // Giá mặc định (10,000 VNĐ)
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
