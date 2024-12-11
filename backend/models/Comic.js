const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema({
  title: String,
  comic_id: Number,
  author: String,
  price: Number,
  category_id: Number,
  genre: [String],
  description: String,
  cover_image: String,
});

module.exports = mongoose.model("Comic", comicSchema);
