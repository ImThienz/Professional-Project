const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const comicSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    cover_image: { type: String },
    genre: { type: String, required: true},
    reviews: [reviewSchema], // Thêm reviews vào schema
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comic", comicSchema);
